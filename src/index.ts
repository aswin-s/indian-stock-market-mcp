#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import axios, { type AxiosInstance, type AxiosResponse, type Method } from 'axios';

interface ApiError {
  error: true;
  message: string;
  details: unknown;
}

const API_BASE_URL = process.env.INDIAN_STOCK_API_BASE_URL;
if (!API_BASE_URL) {
  console.error('Error: INDIAN_STOCK_API_BASE_URL environment variable is required');
  process.exit(1);
}
const API_KEYS = [
  process.env.INDIAN_STOCK_API_KEY,
  process.env.INDIAN_STOCK_API_KEY_ALTERNATE,
].filter((key): key is string => Boolean(key));

if (API_KEYS.length === 0) {
  console.error('Error: No API keys found in environment variables');
  process.exit(1);
}

let currentKeyIndex = 0;

const apiClients: AxiosInstance[] = API_KEYS.map(apiKey =>
  axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  })
);

async function apiRequest(method: Method, url: string, config: Record<string, unknown> = {}): Promise<AxiosResponse> {
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const keyIndex = (currentKeyIndex + attempt) % API_KEYS.length;
    const client = apiClients[keyIndex];
    try {
      const response = await client.request({ ...config, method, url });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429 && attempt < API_KEYS.length - 1) {
        console.error(`Key ${keyIndex + 1} rate-limited (429), trying key ${((keyIndex + 1) % API_KEYS.length) + 1}...`);
        currentKeyIndex = (keyIndex + 1) % API_KEYS.length;
        continue;
      }
      throw error;
    }
  }
  throw new Error('No API keys available');
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterResponse(data: any, toolName: string): unknown {
  if (toolName === 'get_stock_details') {
    if (typeof data === 'object' && data !== null) {
      return {
        name: data.name,
        symbol: data.symbol,
        price: data.price || data.currentPrice || data.ltp,
        change: data.change || data.priceChange,
        changePercent: data.changePercent || data.pChange,
        marketCap: data.marketCap,
        pe: data.pe || data.peRatio,
        pb: data.pb || data.pbRatio,
        dividend: data.dividend || data.dividendYield,
        '52WeekHigh': data['52WeekHigh'] || data.high52Week,
        '52WeekLow': data['52WeekLow'] || data.low52Week,
        volume: data.volume,
        sector: data.sector || data.industry,
        exchange: data.exchange,
        isin: data.isin,
        info: data.info ? `${String(data.info).substring(0, 500)}...` : undefined,
      };
    }
  }

  if (toolName === 'get_historical_data' && data && data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: data.data.slice(-100),
      note: `Showing last 100 data points. Original count: ${data.data.length}`,
    };
  }

  if (toolName === 'get_financial_statement') {
    if (data && typeof data === 'object') {
      const filtered: Record<string, unknown> = { ...data };
      Object.keys(filtered).forEach(key => {
        if (Array.isArray(filtered[key]) && (filtered[key] as unknown[]).length > 10) {
          filtered[key] = (filtered[key] as unknown[]).slice(0, 10);
          filtered[`${key}_note`] = `Showing first 10 items. Total: ${(data[key] as unknown[]).length}`;
        }
      });
      return filtered;
    }
  }

  if (toolName === 'get_recent_announcements' || toolName === 'get_market_news') {
    if (Array.isArray(data)) {
      return data.slice(0, 15).map(item => ({
        title: item.title || item.headline,
        date: item.date || item.publishedDate,
        description: item.description ? String(item.description).substring(0, 300) : undefined,
        link: item.link || item.url,
      }));
    }
  }

  if (Array.isArray(data)) {
    return data.slice(0, 20).map(item => {
      if (typeof item === 'object' && item !== null) {
        return {
          name: item.name,
          symbol: item.symbol,
          price: item.price || item.currentPrice || item.ltp,
          change: item.change || item.priceChange,
          changePercent: item.changePercent || item.pChange,
          volume: item.volume,
          value: item.value || item.turnover,
        };
      }
      return item;
    });
  }

  return data;
}

function truncateIfNeeded(data: unknown, maxTokens: number = 20000): unknown {
  const jsonString = JSON.stringify(data, null, 2);
  const tokens = estimateTokens(jsonString);

  if (tokens > maxTokens) {
    return {
      summary: 'Response too large. Showing summary.',
      dataType: Array.isArray(data) ? 'array' : typeof data,
      itemCount: Array.isArray(data) ? data.length : undefined,
      keys: typeof data === 'object' && data !== null ? Object.keys(data) : undefined,
      sample: Array.isArray(data) ? data.slice(0, 5) : undefined,
      message: `Original response estimated at ${tokens} tokens. Use more specific queries or filters.`,
    };
  }

  return data;
}

function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        error: true,
        message: `API Error: ${error.response.status} - ${error.response.statusText}`,
        details: error.response.data,
      };
    }
    if (error.request) {
      return {
        error: true,
        message: 'No response received from API',
        details: error.message,
      };
    }
  }
  return {
    error: true,
    message: 'Request setup error',
    details: error instanceof Error ? error.message : String(error),
  };
}

function toolResult(data: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

function toolError(error: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(handleApiError(error), null, 2) }], isError: true };
}

async function callApi(method: Method, url: string, toolName: string, config: Record<string, unknown> = {}): Promise<CallToolResult> {
  const response = await apiRequest(method, url, config);
  let filteredData = filterResponse(response.data, toolName);
  filteredData = truncateIfNeeded(filteredData);
  return toolResult(filteredData);
}

// Create MCP server
const server = new McpServer({
  name: 'indian-stock-market',
  version: '1.1.0',
});

// --- Tool registrations ---

server.registerTool(
  'get_stock_details',
  {
    description: 'Get detailed information about a specific stock by name (e.g., "Tata Steel", "Reliance Industries")',
    inputSchema: { name: z.string().describe('Stock name (e.g., "Tata Steel", "HDFC Bank")') },
  },
  async ({ name }) => {
    try {
      return await callApi('get', '/stock', 'get_stock_details', { params: { name } });
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_historical_data',
  {
    description: 'Get historical price data for a stock with various time periods and filters',
    inputSchema: {
      stock_name: z.string().describe('Stock name'),
      period: z.enum(['1m', '6m', '1yr', '3yr', '5yr', '10yr', 'max']).describe('Time period for historical data'),
      filter: z.enum(['default', 'price', 'pe', 'sm', 'evebitda', 'ptb', 'mcs']).default('price').describe('Data filter type'),
    },
  },
  async ({ stock_name, period, filter }) => {
    try {
      return await callApi('get', '/historical_data', 'get_historical_data', {
        params: { stock_name, period, filter: filter || 'price' },
      });
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_trending_stocks',
  { description: 'Get list of currently trending stocks in Indian markets' },
  async () => {
    try {
      return await callApi('get', '/trending', 'get_trending_stocks');
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_market_news',
  { description: 'Get latest market news and updates' },
  async () => {
    try {
      return await callApi('get', '/news', 'get_market_news');
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_nse_most_active',
  { description: 'Get most active stocks on NSE (National Stock Exchange)' },
  async () => {
    try {
      return await callApi('get', '/NSE_most_active', 'get_nse_most_active');
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_bse_most_active',
  { description: 'Get most active stocks on BSE (Bombay Stock Exchange)' },
  async () => {
    try {
      return await callApi('get', '/BSE_most_active', 'get_bse_most_active');
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_price_shockers',
  { description: 'Get stocks with significant price movements (gainers and losers)' },
  async () => {
    try {
      return await callApi('get', '/price_shockers', 'get_price_shockers');
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_52_week_high_low',
  { description: 'Get stocks at or near their 52-week high/low' },
  async () => {
    try {
      return await callApi('get', '/fetch_52_week_high_low_data', 'get_52_week_high_low');
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_ipo_data',
  { description: 'Get information about current and upcoming IPOs' },
  async () => {
    try {
      return await callApi('get', '/ipo', 'get_ipo_data');
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_corporate_actions',
  {
    description: 'Get corporate actions (dividends, bonuses, splits, etc.) for a stock',
    inputSchema: { stock_name: z.string().describe('Stock name') },
  },
  async ({ stock_name }) => {
    try {
      return await callApi('get', '/corporate_actions', 'get_corporate_actions', {
        params: { stock_name },
      });
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_recent_announcements',
  {
    description: 'Get recent announcements from a company',
    inputSchema: { stock_name: z.string().describe('Stock name') },
  },
  async ({ stock_name }) => {
    try {
      return await callApi('get', '/recent_announcements', 'get_recent_announcements', {
        params: { stock_name },
      });
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_financial_statement',
  {
    description: 'Get financial statements (income statement, balance sheet, cash flow) for a stock',
    inputSchema: {
      stock_name: z.string().describe('Stock name'),
      stats: z.string().describe('Type of statement: income, balance, cashflow'),
    },
  },
  async ({ stock_name, stats }) => {
    try {
      return await callApi('get', '/statement', 'get_financial_statement', {
        params: { stock_name, stats },
      });
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_stock_target_price',
  {
    description: 'Get analyst target price for a stock',
    inputSchema: { stock_id: z.string().describe('Stock ID or symbol') },
  },
  async ({ stock_id }) => {
    try {
      return await callApi('get', '/stock_target_price', 'get_stock_target_price', {
        params: { stock_id },
      });
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'search_industry',
  {
    description: 'Search for stocks by industry or sector',
    inputSchema: { query: z.string().describe('Industry or sector name (e.g., "Banking", "Pharma", "IT")') },
  },
  async ({ query }) => {
    try {
      return await callApi('get', '/industry_search', 'search_industry', {
        params: { query },
      });
    } catch (error) {
      return toolError(error);
    }
  }
);

server.registerTool(
  'get_commodities',
  { description: 'Get commodity prices (gold, silver, crude oil, etc.)' },
  async () => {
    try {
      return await callApi('get', '/commodities', 'get_commodities');
    } catch (error) {
      return toolError(error);
    }
  }
);

// Start the server
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Indian Stock Market MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
