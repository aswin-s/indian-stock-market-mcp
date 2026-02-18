#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
// Environment variables are passed via MCP server config in .claude.json

const API_BASE_URL = process.env.INDIAN_STOCK_API_BASE_URL || 'https://api.indianstocks.com';
const API_KEYS = [
  process.env.INDIAN_STOCK_API_KEY,
  process.env.INDIAN_STOCK_API_KEY_ALTERNATE,
].filter(Boolean);

if (API_KEYS.length === 0) {
  console.error('Error: No API keys found in environment variables');
  process.exit(1);
}

let currentKeyIndex = 0;

function createApiClient(apiKey) {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });
}

// Try request with current key, fallback to alternate on 429
async function apiRequest(method, url, config = {}) {
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const keyIndex = (currentKeyIndex + attempt) % API_KEYS.length;
    const client = createApiClient(API_KEYS[keyIndex]);
    try {
      const response = await client[method](url, config);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429 && attempt < API_KEYS.length - 1) {
        console.error(`Key ${keyIndex + 1} rate-limited (429), trying key ${((keyIndex + 1) % API_KEYS.length) + 1}...`);
        currentKeyIndex = (keyIndex + 1) % API_KEYS.length;
        continue;
      }
      throw error;
    }
  }
}

// Create MCP server instance
const server = new Server(
  {
    name: 'indian-stock-market',
    version: '1.0.1',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to estimate token count (rough estimate: 1 token ≈ 4 chars)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Helper function to filter and limit response data
function filterResponse(data, toolName) {
  // For stock details, extract only essential fields
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
        // Include basic info but skip massive nested objects
        info: data.info ? `${String(data.info).substring(0, 500)}...` : undefined,
      };
    }
  }

  // For list responses, limit to top 20 items
  if (Array.isArray(data)) {
    return data.slice(0, 20).map(item => {
      if (typeof item === 'object' && item !== null) {
        // Keep only essential fields from each item
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

  // For historical data, limit data points
  if (toolName === 'get_historical_data' && data && data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: data.data.slice(-100), // Keep last 100 data points
      note: `Showing last 100 data points. Original count: ${data.data.length}`,
    };
  }

  // For financial statements, keep structure but limit details
  if (toolName === 'get_financial_statement') {
    if (data && typeof data === 'object') {
      const filtered = { ...data };
      // Limit array lengths in financial data
      Object.keys(filtered).forEach(key => {
        if (Array.isArray(filtered[key]) && filtered[key].length > 10) {
          filtered[key] = filtered[key].slice(0, 10);
          filtered[`${key}_note`] = `Showing first 10 items. Total: ${data[key].length}`;
        }
      });
      return filtered;
    }
  }

  // For announcements and news, limit to 15 items
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

  return data;
}

// Helper function to truncate response if too large
function truncateIfNeeded(data, maxTokens = 20000) {
  const jsonString = JSON.stringify(data, null, 2);
  const tokens = estimateTokens(jsonString);

  if (tokens > maxTokens) {
    // If still too large, provide a summary
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

// Helper function to handle API errors
function handleApiError(error) {
  if (error.response) {
    return {
      error: true,
      message: `API Error: ${error.response.status} - ${error.response.statusText}`,
      details: error.response.data,
    };
  } else if (error.request) {
    return {
      error: true,
      message: 'No response received from API',
      details: error.message,
    };
  } else {
    return {
      error: true,
      message: 'Request setup error',
      details: error.message,
    };
  }
}

// Tool definitions
const TOOLS = [
  {
    name: 'get_stock_details',
    description: 'Get detailed information about a specific stock by name (e.g., "Tata Steel", "Reliance Industries")',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Stock name (e.g., "Tata Steel", "HDFC Bank")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_historical_data',
    description: 'Get historical price data for a stock with various time periods and filters',
    inputSchema: {
      type: 'object',
      properties: {
        stock_name: {
          type: 'string',
          description: 'Stock name',
        },
        period: {
          type: 'string',
          enum: ['1m', '6m', '1yr', '3yr', '5yr', '10yr', 'max'],
          description: 'Time period for historical data',
        },
        filter: {
          type: 'string',
          enum: ['default', 'price', 'pe', 'sm', 'evebitda', 'ptb', 'mcs'],
          description: 'Data filter type',
          default: 'price',
        },
      },
      required: ['stock_name', 'period'],
    },
  },
  {
    name: 'get_trending_stocks',
    description: 'Get list of currently trending stocks in Indian markets',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_market_news',
    description: 'Get latest market news and updates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_nse_most_active',
    description: 'Get most active stocks on NSE (National Stock Exchange)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_bse_most_active',
    description: 'Get most active stocks on BSE (Bombay Stock Exchange)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_price_shockers',
    description: 'Get stocks with significant price movements (gainers and losers)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_52_week_high_low',
    description: 'Get stocks at or near their 52-week high/low',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_ipo_data',
    description: 'Get information about current and upcoming IPOs',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_corporate_actions',
    description: 'Get corporate actions (dividends, bonuses, splits, etc.) for a stock',
    inputSchema: {
      type: 'object',
      properties: {
        stock_name: {
          type: 'string',
          description: 'Stock name',
        },
      },
      required: ['stock_name'],
    },
  },
  {
    name: 'get_recent_announcements',
    description: 'Get recent announcements from a company',
    inputSchema: {
      type: 'object',
      properties: {
        stock_name: {
          type: 'string',
          description: 'Stock name',
        },
      },
      required: ['stock_name'],
    },
  },
  {
    name: 'get_financial_statement',
    description: 'Get financial statements (income statement, balance sheet, cash flow) for a stock',
    inputSchema: {
      type: 'object',
      properties: {
        stock_name: {
          type: 'string',
          description: 'Stock name',
        },
        stats: {
          type: 'string',
          description: 'Type of statement: income, balance, cashflow',
        },
      },
      required: ['stock_name', 'stats'],
    },
  },
  {
    name: 'get_stock_target_price',
    description: 'Get analyst target price for a stock',
    inputSchema: {
      type: 'object',
      properties: {
        stock_id: {
          type: 'string',
          description: 'Stock ID or symbol',
        },
      },
      required: ['stock_id'],
    },
  },
  {
    name: 'search_industry',
    description: 'Search for stocks by industry or sector',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Industry or sector name (e.g., "Banking", "Pharma", "IT")',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_commodities',
    description: 'Get commodity prices (gold, silver, crude oil, etc.)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Register tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let response;

    switch (name) {
      case 'get_stock_details':
        response = await apiRequest('get','/stock', {
          params: { name: args.name },
        });
        break;

      case 'get_historical_data':
        response = await apiRequest('get','/historical_data', {
          params: {
            stock_name: args.stock_name,
            period: args.period,
            filter: args.filter || 'price',
          },
        });
        break;

      case 'get_trending_stocks':
        response = await apiRequest('get','/trending');
        break;

      case 'get_market_news':
        response = await apiRequest('get','/news');
        break;

      case 'get_nse_most_active':
        response = await apiRequest('get','/NSE_most_active');
        break;

      case 'get_bse_most_active':
        response = await apiRequest('get','/BSE_most_active');
        break;

      case 'get_price_shockers':
        response = await apiRequest('get','/price_shockers');
        break;

      case 'get_52_week_high_low':
        response = await apiRequest('get','/fetch_52_week_high_low_data');
        break;

      case 'get_ipo_data':
        response = await apiRequest('get','/ipo');
        break;

      case 'get_corporate_actions':
        response = await apiRequest('get','/corporate_actions', {
          params: { stock_name: args.stock_name },
        });
        break;

      case 'get_recent_announcements':
        response = await apiRequest('get','/recent_announcements', {
          params: { stock_name: args.stock_name },
        });
        break;

      case 'get_financial_statement':
        response = await apiRequest('get','/statement', {
          params: {
            stock_name: args.stock_name,
            stats: args.stats,
          },
        });
        break;

      case 'get_stock_target_price':
        response = await apiRequest('get','/stock_target_price', {
          params: { stock_id: args.stock_id },
        });
        break;

      case 'search_industry':
        response = await apiRequest('get','/industry_search', {
          params: { query: args.query },
        });
        break;

      case 'get_commodities':
        response = await apiRequest('get','/commodities');
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    // Filter and limit the response data
    let filteredData = filterResponse(response.data, name);

    // Apply final truncation if still too large
    filteredData = truncateIfNeeded(filteredData);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(filteredData, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorResponse = handleApiError(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(errorResponse, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Indian Stock Market MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
