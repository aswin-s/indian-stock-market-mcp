# Command Reference

Quick reference for installing and managing the Indian Stock Market MCP server.

## Installation

### Method 1: Using Claude CLI (Recommended)

**Interactive installation:**
```bash
claude mcp add indian-stock-market
```

Follow the prompts:
1. Select: `node`
2. Enter path: `/Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js`
3. Add env var `INDIAN_STOCK_API_KEY`: `your_key`
4. Add env var `INDIAN_STOCK_API_BASE_URL`: `https://your-url.com`
5. Restart Claude Code

**One-line installation:**
```bash
claude mcp add indian-stock-market \
  --type node \
  --command /Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js \
  --env INDIAN_STOCK_API_KEY=your_api_key_here \
  --env INDIAN_STOCK_API_BASE_URL=https://your-api-url.com
```

### Method 2: Manual Setup

```bash
cd /Users/aswin/Documents/Projects/trade-assist/mcp-server
./setup.sh
# Then manually edit ~/Library/Application Support/Claude/claude_desktop_config.json
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
claude mcp add indian-stock-market
# Re-enter updated configuration
```

### Check MCP server status
```bash
# In Claude Code, type:
/mcp list
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

### View Claude Code config
```bash
# macOS
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Linux
cat ~/.config/claude-code/claude_desktop_config.json

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

### View Claude Code logs (macOS)
```bash
# Check Console.app for "Claude" or "MCP" logs
open /Applications/Utilities/Console.app
```

### Reset MCP server
```bash
claude mcp remove indian-stock-market
rm -rf node_modules package-lock.json
npm install
claude mcp add indian-stock-market
# Re-configure
```

---

## Quick Setup (Copy-Paste)

```bash
# 1. Navigate to directory
cd /Users/aswin/Documents/Projects/trade-assist/mcp-server

# 2. Install dependencies
npm install

# 3. Create .env file (edit with your credentials)
cat > .env << 'EOF'
INDIAN_STOCK_API_BASE_URL=https://your-api-url.com
INDIAN_STOCK_API_KEY=your_api_key_here
EOF

# 4. Add to Claude Code
claude mcp add indian-stock-market \
  --type node \
  --command $(pwd)/index.js

# 5. Restart Claude Code
# Quit Claude Code completely, then relaunch
```

---

## Usage Examples in Claude Code

Once installed, try these commands in Claude Code:

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
| `INDIAN_STOCK_API_BASE_URL` | API base URL | `https://api.example.com` |
| `INDIAN_STOCK_API_KEY` | Your API key | `sk_live_abc123...` |

**Where to set them:**

1. **In `.env` file** (recommended):
   ```
   mcp-server/.env
   ```

2. **In Claude Code config** (less secure):
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

## File Locations

| File | Path |
|------|------|
| MCP Server | `~/Documents/Projects/trade-assist/mcp-server/index.js` |
| Config (macOS) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Config (Linux) | `~/.config/claude-code/claude_desktop_config.json` |
| Config (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Environment | `~/Documents/Projects/trade-assist/mcp-server/.env` |

---

## Getting Help

1. **Check installation**: `npm start` (should run without errors)
2. **View available tools**: `/mcp list` in Claude Code
3. **Read documentation**: See `README.md` for detailed tool reference
4. **Test API**: Use `npm test` to verify API connectivity
5. **Check logs**: Look for errors in Claude Code console

---

## Common Issues & Fixes

| Issue | Command |
|-------|---------|
| MCP not found | `claude mcp list` to verify installation |
| Wrong credentials | `claude mcp remove indian-stock-market && claude mcp add indian-stock-market` |
| Server not starting | `node index.js` to see error messages |
| Dependencies missing | `npm install` |
| Config not found | Check file location for your OS above |
| Tools not appearing | Restart Claude Code completely (Cmd+Q / Alt+F4) |

---

## Version Information

Check versions:
```bash
node --version   # Should be v18+
npm --version    # Should be v9+
claude --version # Claude Code CLI version
```

---

**For complete documentation, see:**
- `INSTALL.md` - Detailed installation guide with `claude mcp add`
- `QUICKSTART.md` - 5-minute setup guide
- `README.md` - Full tool reference and API documentation
