# Indian Stock Market MCP Server

MCP server that provides real-time access to Indian stock market data through 15 tools. Works with **Claude Desktop**, **Claude Code**, **Cursor**, **Windsurf**, and any MCP-compatible client.

Powered by [IndianAPI.in](https://indianapi.in/indian-stock-market).

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **API Key** from [IndianAPI.in](https://indianapi.in/indian-stock-market) - subscribe to get your API key and base URL

## Installation

The server runs via `npx` - no clone or install needed.

### Universal Config Shape

Every MCP client uses the same config structure:

```json
{
  "mcpServers": {
    "indian-stock-market": {
      "command": "npx",
      "args": ["-y", "indian-stock-market-mcp"],
      "env": {
        "INDIAN_STOCK_API_KEY": "your_api_key_here",
        "INDIAN_STOCK_API_BASE_URL": "https://your-api-base-url.com"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config file:

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

Paste the universal config shape above, then restart Claude Desktop.

### Claude Code

```bash
claude mcp add indian-stock-market \
  -e INDIAN_STOCK_API_KEY=your_api_key_here \
  -e INDIAN_STOCK_API_BASE_URL=https://your-api-base-url.com \
  -- npx -y indian-stock-market-mcp
```

### Cursor

Add the universal config shape to `.cursor/mcp.json` in your project root (or global settings).

### Windsurf

Add the universal config shape to `~/.codeium/windsurf/mcp_config.json`.

---

## Available Tools (15)

### Stock Information
- **get_stock_details** - Detailed info about any stock
- **get_historical_data** - Historical price data with multiple timeframes
- **get_stock_target_price** - Analyst target prices
- **get_corporate_actions** - Dividends, bonuses, splits
- **get_recent_announcements** - Latest company announcements
- **get_financial_statement** - Income statement, balance sheet, cash flow

### Market Overview
- **get_trending_stocks** - Currently trending stocks
- **get_nse_most_active** - Most active NSE stocks
- **get_bse_most_active** - Most active BSE stocks
- **get_price_shockers** - Significant gainers and losers
- **get_52_week_high_low** - Stocks at 52-week extremes

### Market Data
- **get_market_news** - Latest market news
- **get_ipo_data** - Current and upcoming IPOs
- **get_commodities** - Commodity prices
- **search_industry** - Find stocks by sector/industry

## Usage Examples

Once configured, use natural language in your AI assistant:

```
Get me the latest details for Tata Steel
```

```
Show me the 1-year price history for HDFC Bank
```

```
What are the trending stocks today?
```

```
Find all banking stocks and their performance
```

```
Get financial statements for Infosys - income statement and balance sheet
```

```
Give me today's market briefing: NSE most active, price shockers, and commodity prices
```

## Tool Reference

### get_stock_details

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | yes | Stock name (e.g., "Tata Steel", "HDFC Bank") |

Returns: Stock price, market cap, P/E, 52-week high/low, volume, etc.

### get_historical_data

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stock_name` | string | yes | Stock name |
| `period` | enum | yes | `1m`, `6m`, `1yr`, `3yr`, `5yr`, `10yr`, `max` |
| `filter` | enum | no | `default`, `price`, `pe`, `sm`, `evebitda`, `ptb`, `mcs` (default: `price`) |

### get_financial_statement

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stock_name` | string | yes | Stock name |
| `stats` | string | yes | `income`, `balance`, `cashflow` |

### get_corporate_actions

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stock_name` | string | yes | Stock name |

### get_recent_announcements

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stock_name` | string | yes | Stock name |

### get_stock_target_price

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stock_id` | string | yes | Stock ID or symbol |

### search_industry

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Industry/sector name (e.g., "Banking", "Pharma", "IT") |

### Zero-parameter tools

`get_trending_stocks`, `get_market_news`, `get_nse_most_active`, `get_bse_most_active`, `get_price_shockers`, `get_52_week_high_low`, `get_ipo_data`, `get_commodities` — no parameters required.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `INDIAN_STOCK_API_BASE_URL` | yes | API base URL from IndianAPI.in |
| `INDIAN_STOCK_API_KEY` | yes | Your API key from IndianAPI.in |
| `INDIAN_STOCK_API_KEY_ALTERNATE` | no | Fallback key for rate-limit rotation |

## Response Filtering

The server automatically filters and limits API responses to stay within token limits:

- **Stock Details** — essential fields only (price, market cap, P/E, 52-week high/low, volume, sector)
- **List Responses** — top 20 items with essential fields
- **Historical Data** — last 100 data points
- **Financial Statements** — arrays limited to 10 items
- **News/Announcements** — 15 items, descriptions truncated to 300 chars
- **Fallback** — if still >20,000 tokens, a summary is returned with data type, count, and sample

## Development

For contributors working on the server itself:

```bash
git clone https://github.com/aswin-s/indian-stock-market-mcp.git
cd indian-stock-market-mcp
bun install

# Create .env with your API credentials
cp .env.example .env

# Build TypeScript to dist/
bun run build

# Run in development mode (uses tsx, no build step needed)
bun run dev
```

### Adding New Tools

1. Add a `server.registerTool(...)` call in `src/index.ts`
2. Add response filtering logic in `filterResponse()` if needed
3. Update this README

## Troubleshooting

### "INDIAN_STOCK_API_KEY not found" / "INDIAN_STOCK_API_BASE_URL is required"

Ensure the environment variables are set in your MCP client config (see Installation above).

### "Cannot find module '@modelcontextprotocol/sdk'"

If running from source, run `bun install` (or `npm install`). If using `npx`, try `npx -y indian-stock-market-mcp` to force a fresh install.

### Server not appearing in your client

1. Verify the config JSON is valid (no trailing commas)
2. Restart your MCP client completely
3. Check client logs for errors

### API requests timing out

Default timeout is 30 seconds. If your API is slower, modify the `timeout` value in `createApiClient` in `src/index.ts`.

## API Endpoints

| MCP Tool | API Endpoint |
|----------|--------------|
| get_stock_details | /stock |
| get_historical_data | /historical_data |
| get_trending_stocks | /trending |
| get_market_news | /news |
| get_nse_most_active | /NSE_most_active |
| get_bse_most_active | /BSE_most_active |
| get_price_shockers | /price_shockers |
| get_52_week_high_low | /fetch_52_week_high_low_data |
| get_ipo_data | /ipo |
| get_corporate_actions | /corporate_actions |
| get_recent_announcements | /recent_announcements |
| get_financial_statement | /statement |
| get_stock_target_price | /stock_target_price |
| search_industry | /industry_search |
| get_commodities | /commodities |

## License

MIT
