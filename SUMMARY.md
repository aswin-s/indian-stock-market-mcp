# Indian Stock Market MCP Server - Summary

## What Is This?

An MCP (Model Context Protocol) server that gives Claude Code real-time access to Indian stock market data through 15 powerful tools.

## What Can It Do?

Access live market data directly in your Claude Code conversations:

- 📊 **Stock Details** - Real-time prices, P/E ratios, market cap
- 📈 **Historical Data** - Price history from 1 month to max
- 💰 **Financial Statements** - Income, balance sheet, cash flow
- 📰 **News & Announcements** - Latest company updates
- 🎯 **Market Screening** - Trending stocks, gainers/losers
- 🏢 **Sector Analysis** - Find stocks by industry
- 💎 **Corporate Actions** - Dividends, bonuses, splits
- 📉 **Analyst Targets** - Professional price targets
- 🌾 **Commodities** - Gold, silver, crude oil prices
- 📊 **IPO Data** - Current and upcoming IPOs

## Installation (2 Methods)

### Method 1: Claude CLI (Recommended) ⚡

```bash
cd /Users/aswin/Documents/Projects/trade-assist/mcp-server
npm install
claude mcp add indian-stock-market
```

**Then enter:**
- Type: `node`
- Path: `/Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js`
- Env vars: Your API key and base URL

**See**: [INSTALL.md](INSTALL.md) for detailed steps

### Method 2: Automated Script 🤖

```bash
cd /Users/aswin/Documents/Projects/trade-assist/mcp-server
./setup.sh
```

Then manually add to Claude Code config (script shows you how).

**See**: [QUICKSTART.md](QUICKSTART.md) for 5-minute guide

## After Installation

1. **Restart Claude Code** completely
2. **Test** with: `Get me the latest details for Tata Steel`
3. **Explore** the 15 available tools

## Example Queries

Try these in Claude Code once installed:

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
mcp-server/
├── index.js           # Main MCP server (run this)
├── package.json       # Dependencies
├── .env              # Your API credentials (create from .env.example)
├── INSTALL.md        # Using claude mcp add (recommended)
├── QUICKSTART.md     # 5-minute setup guide
├── README.md         # Complete documentation
├── COMMANDS.md       # Command reference
└── setup.sh          # Automated setup script
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `claude mcp add indian-stock-market` | Install MCP server |
| `claude mcp list` | List installed servers |
| `claude mcp remove indian-stock-market` | Uninstall server |
| `npm install` | Install dependencies |
| `npm start` | Test server manually |
| `/mcp list` | (In Claude Code) View tools |

## Configuration Files

Your API credentials go in **ONE** of these places:

1. **`.env` file** (recommended):
   ```
   /Users/aswin/Documents/Projects/trade-assist/mcp-server/.env
   ```

2. **Claude Code config**:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

## Available Tools (15 Total)

1. `get_stock_details` - Stock information
2. `get_historical_data` - Price history
3. `get_trending_stocks` - Market movers
4. `get_market_news` - Latest news
5. `get_nse_most_active` - NSE active stocks
6. `get_bse_most_active` - BSE active stocks
7. `get_price_shockers` - Gainers/losers
8. `get_52_week_high_low` - Extremes
9. `get_ipo_data` - IPO information
10. `get_corporate_actions` - Dividends, etc.
11. `get_recent_announcements` - Company news
12. `get_financial_statement` - Financials
13. `get_stock_target_price` - Analyst targets
14. `search_industry` - Sector search
15. `get_commodities` - Commodity prices

## Requirements

- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ Claude Code installed
- ✅ Indian Stock API credentials (key + base URL)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Server not appearing | Restart Claude Code completely |
| "Command not found" | Run `npm install` first |
| API errors | Check your credentials in `.env` |
| Tools not working | Test with `npm start` |
| Wrong credentials | Run `claude mcp remove` then `claude mcp add` again |

## Documentation

- **[INSTALL.md](INSTALL.md)** - Complete installation guide using `claude mcp add`
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup
- **[COMMANDS.md](COMMANDS.md)** - Command reference
- **[README.md](README.md)** - Full documentation with tool reference

## Quick Start

**Absolute fastest way to get started:**

1. **Install**:
   ```bash
   cd /Users/aswin/Documents/Projects/trade-assist/mcp-server
   npm install
   ```

2. **Configure**:
   ```bash
   claude mcp add indian-stock-market
   # Follow prompts - takes 1 minute
   ```

3. **Restart** Claude Code

4. **Test**:
   ```
   Get me details for Tata Steel
   ```

That's it! 🎉

## Benefits

✅ **Real-time market data** in conversations
✅ **15 comprehensive tools** covering all market data needs
✅ **Natural language queries** - no API knowledge needed
✅ **Seamless integration** with Claude Code
✅ **Secure** - API keys in environment variables
✅ **Production-ready** - Error handling & timeouts
✅ **Smart response filtering** - Automatically limits data to stay within token limits

## Use Cases

- **Portfolio Analysis** - Monitor your holdings with live data
- **Stock Research** - Deep dive into any company
- **Market Screening** - Find stocks matching criteria
- **Daily Briefings** - Get market overview automatically
- **Sector Analysis** - Compare stocks in same industry
- **Trade Ideas** - Identify opportunities with technical data

## Next Steps

1. ✅ Install the MCP server (see above)
2. ✅ Restart Claude Code
3. ✅ Try example queries
4. ✅ Integrate with your workflows
5. ✅ Build custom analysis tools

---

**Ready to get started?**

→ See [INSTALL.md](INSTALL.md) for step-by-step `claude mcp add` instructions
→ Or [QUICKSTART.md](QUICKSTART.md) for the fastest setup

**Questions?** Check [README.md](README.md) for complete documentation.
