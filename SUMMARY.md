# Indian Stock Market MCP Server - Summary

## What Is This?

An MCP (Model Context Protocol) server that gives Claude real-time access to Indian stock market data through 15 tools. Powered by [IndianAPI.in](https://indianapi.in/indian-stock-market).

## What Can It Do?

Access live market data directly in your Claude conversations:

- **Stock Details** - Real-time prices, P/E ratios, market cap
- **Historical Data** - Price history from 1 month to max
- **Financial Statements** - Income, balance sheet, cash flow
- **News & Announcements** - Latest company updates
- **Market Screening** - Trending stocks, gainers/losers
- **Sector Analysis** - Find stocks by industry
- **Corporate Actions** - Dividends, bonuses, splits
- **Analyst Targets** - Professional price targets
- **Commodities** - Gold, silver, crude oil prices
- **IPO Data** - Current and upcoming IPOs

## Installation (2 Methods)

### Method 1: Claude CLI (Recommended)

```bash
git clone https://github.com/<your-username>/indian-stock-market-mcp.git
cd indian-stock-market-mcp
npm install
claude mcp add indian-stock-market -s user -- node $(pwd)/index.js
```

Then configure your `.env` file with API credentials from [IndianAPI.in](https://indianapi.in/indian-stock-market).

**See**: [INSTALL.md](INSTALL.md) for detailed steps

### Method 2: Setup Script

```bash
git clone https://github.com/<your-username>/indian-stock-market-mcp.git
cd indian-stock-market-mcp
./setup.sh
```

Then manually add to Claude config (script shows you how).

**See**: [QUICKSTART.md](QUICKSTART.md) for 5-minute guide

## After Installation

1. **Restart Claude** completely
2. **Test** with: `Get me the latest details for Tata Steel`
3. **Explore** the 15 available tools

## Example Queries

Try these in Claude once installed:

```
Get me details for Reliance Industries
```

```
What are the trending stocks today?
```

```
Show me the most active NSE stocks
```

```
Find all banking stocks with P/E ratio below 15
```

```
Analyze my portfolio: TATPOW, FEDBAN, RVNL, HDFBAN
Get current prices, 52-week performance, and recent news
```

```
Get 1-year historical data for TCS
```

```
Check if HDFC Bank has any upcoming dividends
```

## File Structure

```
indian-stock-market-mcp/
├── index.js              # Main MCP server (run this)
├── package.json          # Dependencies
├── .env.example          # Template for API credentials
├── .env                  # Your API credentials (create from .env.example)
├── INSTALL.md            # Using claude mcp add (recommended)
├── QUICKSTART.md         # 5-minute setup guide
├── README.md             # Complete documentation
├── COMMANDS.md           # Command reference
├── setup.sh              # Automated setup script
└── install-one-click.sh  # One-click install script
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `claude mcp add indian-stock-market -s user -- node $(pwd)/index.js` | Install MCP server |
| `claude mcp list` | List installed servers |
| `claude mcp remove indian-stock-market` | Uninstall server |
| `npm install` | Install dependencies |
| `npm start` | Test server manually |

## Configuration

Your API credentials go in **ONE** of these places:

1. **`.env` file** (recommended) - in the project root
2. **Claude Desktop config** - see [INSTALL.md](INSTALL.md) for file locations

## Requirements

- Node.js 18+ ([Download](https://nodejs.org/))
- Claude Code or Claude Desktop installed
- API credentials from [IndianAPI.in](https://indianapi.in/indian-stock-market) (subscribe to a plan)

## Documentation

- **[INSTALL.md](INSTALL.md)** - Complete installation guide using `claude mcp add`
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup
- **[COMMANDS.md](COMMANDS.md)** - Command reference
- **[README.md](README.md)** - Full documentation with tool reference
