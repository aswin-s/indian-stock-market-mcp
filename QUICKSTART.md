# Quick Start Guide

Get the Indian Stock Market MCP Server running in 5 minutes.

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- API credentials from [IndianAPI.in](https://indianapi.in/indian-stock-market) (subscribe to a plan to get your API key and base URL)
- Claude Code or Claude Desktop installed

## Step 1: Install (2 minutes)

```bash
git clone https://github.com/<your-username>/indian-stock-market-mcp.git
cd indian-stock-market-mcp
npm install
```

Or run the setup script:

```bash
./setup.sh
```

The setup script will:
- Install npm dependencies
- Create `.env` file from template
- Show you the Claude configuration options

## Step 2: Configure API Credentials (1 minute)

Edit the `.env` file:

```bash
nano .env  # or use your preferred editor
```

Add your credentials from [IndianAPI.in](https://indianapi.in/indian-stock-market):

```env
INDIAN_STOCK_API_BASE_URL=https://your-actual-api-url.com
INDIAN_STOCK_API_KEY=your_actual_api_key_here
```

## Step 3: Test the Server (30 seconds)

```bash
npm start
```

You should see: `Indian Stock Market MCP Server running on stdio`

Press `Ctrl+C` to stop.

## Step 4: Add to Claude (1 minute)

### Option A: Claude CLI (Recommended)

```bash
claude mcp add indian-stock-market -s user -- node $(pwd)/index.js
```

### Option B: Manual Config

Add to your Claude Desktop config file:

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
        "INDIAN_STOCK_API_KEY": "your_actual_key",
        "INDIAN_STOCK_API_BASE_URL": "https://your-actual-url.com"
      }
    }
  }
}
```

**Important**: Replace the path with the absolute path to where you cloned the repo.

## Step 5: Restart Claude (30 seconds)

Completely quit and restart Claude for the changes to take effect.

## Step 6: Test in Claude (30 seconds)

Open Claude and try:

```
Get me the latest details for Tata Steel
```

or

```
What are the trending stocks today?
```

Claude should now use the MCP server tools to fetch live market data!

## Troubleshooting

### Server not appearing in Claude

1. Check the path in your config is correct and absolute
2. Verify your API credentials in `.env` or config
3. Try running `npm start` manually to check for errors
4. Restart Claude completely (Cmd+Q / Alt+F4, then relaunch)

### "API key not found" error

Make sure the API key is either:
- In the `.env` file in the project directory, OR
- In the `env` section of your Claude config

### Connection errors

- Verify your `INDIAN_STOCK_API_BASE_URL` is correct
- Check your internet connection
- Verify the API service is operational at [IndianAPI.in](https://indianapi.in)

## Next Steps

- See `README.md` for complete tool reference
- Explore the 15 available tools
- Try complex queries that combine multiple tools
- Build stock analysis workflows

## Common Use Cases

### Portfolio Analysis

```
Analyze my portfolio stocks: Reliance, TCS, HDFC Bank, Infosys
Get their current prices, 52-week performance, and recent news
```

### Market Screening

```
Find all trending banking stocks with their P/E ratios and
show me which ones are near their 52-week highs
```

### Company Deep Dive

```
Full analysis of Tata Motors:
1. Current stock details
2. Last 3 years price history
3. Financial statements (income + balance sheet)
4. Recent corporate actions
5. Latest announcements
```

### Daily Briefing

```
Give me today's market briefing:
- NSE most active stocks
- Price shockers (gainers/losers)
- Latest market news
- Commodity prices
```
