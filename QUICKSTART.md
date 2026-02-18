# Quick Start Guide

Get the Indian Stock Market MCP Server running in 5 minutes.

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- Indian Stock API credentials (API key and base URL)
- Claude Code installed

## Step 1: Install (2 minutes)

```bash
cd /Users/aswin/Documents/Projects/trade-assist/mcp-server
./setup.sh
```

The setup script will:
- Install npm dependencies
- Create `.env` file from template
- Show you the Claude Code configuration

## Step 2: Configure API Credentials (1 minute)

Edit the `.env` file:

```bash
nano .env  # or use your preferred editor
```

Add your actual credentials:

```env
INDIAN_STOCK_API_BASE_URL=https://your-actual-api-url.com
INDIAN_STOCK_API_KEY=your_actual_api_key_here
```

**Where to find these**:
- Check your parent directory `.env` file: `../env`
- Or get them from your API provider dashboard

## Step 3: Test the Server (30 seconds)

```bash
npm start
```

You should see: `Indian Stock Market MCP Server running on stdio`

Press `Ctrl+C` to stop.

## Step 4: Add to Claude Code (1 minute)

### macOS

1. Open `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Add the MCP server configuration (the setup script showed you this)
3. Save the file

### Linux

1. Open `~/.config/claude-code/claude_desktop_config.json`
2. Add the MCP server configuration
3. Save the file

### Windows

1. Open `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the MCP server configuration
3. Save the file

**Example configuration**:

```json
{
  "mcpServers": {
    "indian-stock-market": {
      "command": "node",
      "args": [
        "/Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js"
      ],
      "env": {
        "INDIAN_STOCK_API_KEY": "your_actual_key",
        "INDIAN_STOCK_API_BASE_URL": "https://your-actual-url.com"
      }
    }
  }
}
```

## Step 5: Restart Claude Code (30 seconds)

Completely quit and restart Claude Code for the changes to take effect.

## Step 6: Test in Claude Code (30 seconds)

Open Claude Code and try:

```
Get me the latest details for Tata Steel
```

or

```
What are the trending stocks today?
```

Claude should now use the MCP server tools to fetch live market data!

## Troubleshooting

### Server not appearing in Claude Code

1. Check the path in `claude_desktop_config.json` is correct and absolute
2. Verify your API credentials in `.env` or config
3. Try running `npm start` manually to check for errors
4. Restart Claude Code completely (Cmd+Q / Alt+F4, then relaunch)

### "API key not found" error

Make sure the API key is either:
- In the `.env` file in the `mcp-server` directory, OR
- In the `env` section of your Claude Code config

### Connection errors

- Verify your `INDIAN_STOCK_API_BASE_URL` is correct
- Check your internet connection
- Verify the API service is operational

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

## Support

- Full documentation: `README.md`
- API reference: `../indian-stock-api.json`
- Issues: Check server logs with `npm start`

Enjoy live market data in Claude Code! 🚀📈
