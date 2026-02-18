# Indian Stock Market MCP Server

MCP (Model Context Protocol) server that provides Claude with real-time access to Indian stock market data through a comprehensive API.

## Features

This MCP server exposes 15 tools for accessing Indian stock market data:

### Stock Information
- **get_stock_details** - Get detailed information about any stock
- **get_historical_data** - Historical price data with multiple timeframes
- **get_stock_target_price** - Analyst target prices
- **get_corporate_actions** - Dividends, bonuses, splits, etc.
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

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **API Key** from [IndianAPI.in](https://indianapi.in/indian-stock-market) - subscribe to one of their plans to get your API key and base URL

## Installation

### Quick Install (Recommended)

Use the Claude CLI to add the MCP server:

```bash
# Clone and install dependencies
git clone https://github.com/<your-username>/indian-stock-market-mcp.git
cd indian-stock-market-mcp
npm install

# Add to Claude Code
claude mcp add indian-stock-market -s user -- node $(pwd)/index.js
```

Then configure your API credentials in a `.env` file (see step 2 below).

**See [INSTALL.md](INSTALL.md) for complete `claude mcp add` instructions.**

---

### Manual Installation

If you prefer manual setup:

#### 1. Install Dependencies

```bash
git clone https://github.com/<your-username>/indian-stock-market-mcp.git
cd indian-stock-market-mcp
npm install
```

#### 2. Configure Environment Variables

Copy the example environment file and add your API credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
INDIAN_STOCK_API_BASE_URL=https://your-api-base-url.com
INDIAN_STOCK_API_KEY=your_actual_api_key_here
```

#### 3. Test the Server

```bash
npm start
```

The server should start and output: `Indian Stock Market MCP Server running on stdio`

#### 4. Add to Claude Desktop Configuration

Add the MCP server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "indian-stock-market": {
      "command": "node",
      "args": [
        "/absolute/path/to/indian-stock-market-mcp/index.js"
      ],
      "env": {
        "INDIAN_STOCK_API_KEY": "your_api_key_here",
        "INDIAN_STOCK_API_BASE_URL": "https://your-api-base-url.com"
      }
    }
  }
}
```

**Important**: Replace the path and API credentials with your actual values. The path must be absolute.

### Restart Claude

After adding the configuration, restart Claude for the changes to take effect.

## Usage Examples

Once configured, you can use natural language in Claude to access market data:

### Example 1: Get Stock Details

```
User: "Get me the latest details for Tata Steel"
```

Claude will use the `get_stock_details` tool to fetch current price, market cap, P/E ratio, etc.

### Example 2: Historical Analysis

```
User: "Show me the 1-year price history for HDFC Bank"
```

Claude will use `get_historical_data` with period='1yr' and filter='price'.

### Example 3: Market Screening

```
User: "What are the trending stocks today?"
```

Claude will use `get_trending_stocks` to show you the current market movers.

### Example 4: Sector Analysis

```
User: "Find all banking stocks and their performance"
```

Claude will use `search_industry` with query='Banking' and potentially `get_price_shockers` for performance data.

### Example 5: Corporate Actions

```
User: "Check if Reliance Industries has any upcoming dividends"
```

Claude will use `get_corporate_actions` to fetch dividend, bonus, and split information.

### Example 6: Portfolio Research

```
User: "Get financial statements for Infosys - I need income statement and balance sheet"
```

Claude will make multiple calls to `get_financial_statement` with different stats parameters.

## Tool Reference

### get_stock_details

**Parameters:**
- `name` (string, required): Stock name (e.g., "Tata Steel", "HDFC Bank")

**Returns:** Stock price, market cap, P/E, 52-week high/low, volume, etc.

### get_historical_data

**Parameters:**
- `stock_name` (string, required): Stock name
- `period` (enum, required): Time period
  - Options: `1m`, `6m`, `1yr`, `3yr`, `5yr`, `10yr`, `max`
- `filter` (enum, optional): Data filter
  - Options: `default`, `price`, `pe`, `sm`, `evebitda`, `ptb`, `mcs`
  - Default: `price`

**Returns:** Historical data points for the specified period.

### get_financial_statement

**Parameters:**
- `stock_name` (string, required): Stock name
- `stats` (string, required): Statement type
  - Options: `income`, `balance`, `cashflow`

**Returns:** Detailed financial statement data.

### get_corporate_actions

**Parameters:**
- `stock_name` (string, required): Stock name

**Returns:** Dividends, bonuses, stock splits, rights issues, etc.

### search_industry

**Parameters:**
- `query` (string, required): Industry/sector name (e.g., "Banking", "Pharma", "IT")

**Returns:** List of stocks in that industry with key metrics.

## Development

### Run in Development Mode

Uses nodemon for auto-restart on file changes:

```bash
npm run dev
```

### Adding New Tools

To add a new tool:

1. Add tool definition to `TOOLS` array
2. Add corresponding case to the switch statement in `CallToolRequestSchema` handler
3. Update this README with the new tool documentation

### Response Filtering and Size Management

The MCP server automatically filters and limits API responses to stay within Claude's token limits:

**Stock Details** (`get_stock_details`):
- Extracts only essential fields (price, market cap, P/E, 52-week high/low, volume, sector)
- Truncates long text fields to 500 characters
- Removes large nested objects

**List Responses** (trending, most active, price shockers):
- Limited to top 20 items
- Only essential fields per item (name, symbol, price, change, volume)

**Historical Data** (`get_historical_data`):
- Limited to last 100 data points
- Includes note about original data count

**Financial Statements** (`get_financial_statement`):
- Arrays limited to 10 items with count notes
- Structure preserved but details trimmed

**News/Announcements**:
- Limited to 15 items
- Descriptions truncated to 300 characters

**Fallback**: If filtered response still exceeds 20,000 tokens, a summary is provided with data type, item count, keys, and sample data.

### Error Handling

The server includes comprehensive error handling:
- API response errors (4xx, 5xx)
- Network errors
- Timeout errors (30 second timeout)
- Invalid parameters

Errors are returned to Claude in a structured format with details.

## Troubleshooting

### "INDIAN_STOCK_API_KEY not found"

Make sure your `.env` file exists and contains the API key, or the environment variable is set in the Claude configuration.

### "Cannot find module '@modelcontextprotocol/sdk'"

Run `npm install` in the project directory.

### Server not appearing in Claude

1. Check the configuration file path is correct
2. Verify the absolute path to `index.js` is correct
3. Restart Claude completely
4. Check logs for errors

### API requests timing out

The default timeout is 30 seconds. If your API is slower, modify the `timeout` value in `createApiClient` in `index.js`.

### "MCP tool response exceeds maximum allowed tokens"

The server automatically filters and limits responses. If you still encounter this:

1. Update to the latest version
2. Restart Claude
3. Use more specific queries (e.g., "Get price and P/E for Tata Steel" instead of "Get everything about Tata Steel")
4. For historical data, use shorter time periods (e.g., "1yr" instead of "max")

## API Endpoints Mapped

| MCP Tool | API Endpoint | Method |
|----------|--------------|--------|
| get_stock_details | /stock | GET |
| get_historical_data | /historical_data | GET |
| get_trending_stocks | /trending | GET |
| get_market_news | /news | GET |
| get_nse_most_active | /NSE_most_active | GET |
| get_bse_most_active | /BSE_most_active | GET |
| get_price_shockers | /price_shockers | GET |
| get_52_week_high_low | /fetch_52_week_high_low_data | GET |
| get_ipo_data | /ipo | GET |
| get_corporate_actions | /corporate_actions | GET |
| get_recent_announcements | /recent_announcements | GET |
| get_financial_statement | /statement | GET |
| get_stock_target_price | /stock_target_price | GET |
| search_industry | /industry_search | GET |
| get_commodities | /commodities | GET |

## Security

- API key is stored in environment variables (never hardcoded)
- All requests use HTTPS
- API key sent via secure header (`x-api-key`)
- 30-second timeout prevents hanging requests

## License

MIT

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check this README first
2. Review Claude MCP documentation
3. Check API documentation for endpoint-specific issues
4. Open an issue on GitHub
