# Command Reference

Quick reference for installing and managing the Indian Stock Market MCP server.

## Installation

### Method 1: Using Claude CLI (Recommended)

```bash
cd /path/to/indian-stock-market-mcp
npm install
claude mcp add indian-stock-market -s user -- node $(pwd)/index.js
```

### Method 2: Manual Setup

```bash
cd /path/to/indian-stock-market-mcp
./setup.sh
# Then manually add to your Claude config file (script shows you how)
```

---

## Management Commands

### List all MCP servers
```bash
claude mcp list
```

### Remove MCP server
```bash
claude mcp remove indian-stock-market
```

### Update MCP server
```bash
claude mcp remove indian-stock-market
claude mcp add indian-stock-market -s user -- node /path/to/indian-stock-market-mcp/index.js
```

### Check MCP server status
```bash
# In Claude Code:
# Check available MCP tools to verify the server is connected
```

---

## Development Commands

### Install dependencies
```bash
npm install
```

### Start server (for testing)
```bash
npm start
```

### Development mode (auto-reload)
```bash
npm run dev
```

### Run tests
```bash
npm test
```

---

## Verification Commands

### Check Node.js version
```bash
node --version
# Should be v18 or higher
```

### Test server manually
```bash
node index.js
# Should output: "Indian Stock Market MCP Server running on stdio"
# Press Ctrl+C to stop
```

### View Claude Desktop config
```bash
# macOS
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Linux
cat ~/.config/Claude/claude_desktop_config.json

# Windows (PowerShell)
Get-Content $env:APPDATA\Claude\claude_desktop_config.json
```

### Check environment variables
```bash
cat .env
```

---

## Troubleshooting Commands

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check for errors
```bash
# Run server in foreground to see errors
node index.js
```

### Reset MCP server
```bash
claude mcp remove indian-stock-market
rm -rf node_modules package-lock.json
npm install
claude mcp add indian-stock-market -s user -- node $(pwd)/index.js
```

---

## Quick Setup (Copy-Paste)

```bash
# 1. Clone and enter directory
git clone https://github.com/<your-username>/indian-stock-market-mcp.git
cd indian-stock-market-mcp

# 2. Install dependencies
npm install

# 3. Create .env file (edit with your credentials from https://indianapi.in)
cp .env.example .env
# Edit .env with your API key and base URL

# 4. Add to Claude Code
claude mcp add indian-stock-market -s user -- node $(pwd)/index.js

# 5. Restart Claude Code
```

---

## Usage Examples in Claude

Once installed, try these queries in Claude:

### Basic stock query
```
Get me the latest details for Tata Steel
```

### Market overview
```
What are the trending stocks today?
```

### Historical analysis
```
Show me the 1-year price history for HDFC Bank
```

### Portfolio analysis
```
Analyze these stocks: Reliance, TCS, Infosys, HDFC Bank
Show current prices, P/E ratios, and 52-week performance
```

### Sector screening
```
Find all banking stocks with P/E ratio below 15
```

### Corporate actions
```
Check if Reliance Industries has any upcoming dividends
```

### Market screening
```
Show me:
1. Top 5 NSE gainers today
2. Stocks near 52-week high
3. Latest IPOs
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `INDIAN_STOCK_API_BASE_URL` | API base URL from IndianAPI.in | `https://api.example.com` |
| `INDIAN_STOCK_API_KEY` | Your API key from IndianAPI.in | `sk_live_abc123...` |

**Where to set them:**

1. **In `.env` file** (recommended):
   ```bash
   cp .env.example .env
   # Edit with your credentials
   ```

2. **In Claude config** (less secure):
   ```json
   "env": {
     "INDIAN_STOCK_API_KEY": "your_key",
     "INDIAN_STOCK_API_BASE_URL": "https://your-url.com"
   }
   ```

3. **System environment variables** (most secure):
   ```bash
   export INDIAN_STOCK_API_KEY="your_key"
   export INDIAN_STOCK_API_BASE_URL="https://your-url.com"
   ```

---

## Config File Locations

| File | Path |
|------|------|
| Claude Desktop Config (macOS) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop Config (Linux) | `~/.config/Claude/claude_desktop_config.json` |
| Claude Desktop Config (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Environment Variables | `.env` in the project root |

---

## Getting Help

1. **Check installation**: `npm start` (should run without errors)
2. **Read documentation**: See `README.md` for detailed tool reference
3. **Test API**: Use `npm test` to verify API connectivity
4. **Check logs**: Look for errors in Claude console

---

## Common Issues & Fixes

| Issue | Command |
|-------|---------|
| MCP not found | `claude mcp list` to verify installation |
| Wrong credentials | `claude mcp remove indian-stock-market` then re-add |
| Server not starting | `node index.js` to see error messages |
| Dependencies missing | `npm install` |
| Config not found | Check file location for your OS above |
| Tools not appearing | Restart Claude completely (Cmd+Q / Alt+F4) |

---

**For complete documentation, see:**
- `INSTALL.md` - Detailed installation guide with `claude mcp add`
- `QUICKSTART.md` - 5-minute setup guide
- `README.md` - Full tool reference and API documentation
