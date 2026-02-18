# Installing with Claude MCP CLI

This guide shows you how to add the Indian Stock Market MCP server using the `claude mcp add` command.

## Prerequisites

1. Claude Code installed
2. MCP server dependencies installed (`npm install` in this directory)
3. Your API credentials ready

## Installation Steps

### Step 1: Install Dependencies

```bash
cd /Users/aswin/Documents/Projects/trade-assist/mcp-server
npm install
```

### Step 2: Add MCP Server Using CLI

Open your terminal and run:

```bash
claude mcp add indian-stock-market
```

You'll be prompted for the following information:

#### 1. Command Type

```
? What type of command? (Use arrow keys)
❯ node
  python
  custom
```

**Select**: `node`

#### 2. Script Path

```
? Enter the path to your script:
```

**Enter**: `/Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js`

**Tip**: Use the absolute path shown above. Press Tab for autocomplete.

#### 3. Environment Variables

```
? Add environment variable? (Y/n)
```

**Answer**: `Y` (Yes)

Then add your API credentials:

**First variable:**
```
? Environment variable name: INDIAN_STOCK_API_KEY
? Environment variable value: [paste your API key here]
```

**Second variable:**
```
? Add another environment variable? (Y/n) Y
? Environment variable name: INDIAN_STOCK_API_BASE_URL
? Environment variable value: [paste your API base URL here]
```

**Third prompt:**
```
? Add another environment variable? (Y/n) n
```

#### 4. Confirmation

```
✅ MCP server 'indian-stock-market' has been added!
```

### Step 3: Restart Claude Code

Completely quit and restart Claude Code for changes to take effect:

- **macOS**: Cmd+Q, then relaunch
- **Windows**: Alt+F4, then relaunch
- **Linux**: Quit completely, then relaunch

### Step 4: Verify Installation

In Claude Code, type:

```
/mcp list
```

You should see `indian-stock-market` in the list of available MCP servers.

### Step 5: Test It!

Try asking Claude:

```
Get me the latest details for Tata Steel
```

Claude should automatically use the `get_stock_details` tool from your MCP server!

---

## Alternative: One-Line Installation

If you prefer, you can also add the server with a single command by providing all details upfront:

```bash
claude mcp add indian-stock-market \
  --type node \
  --command /Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js \
  --env INDIAN_STOCK_API_KEY=your_api_key_here \
  --env INDIAN_STOCK_API_BASE_URL=https://your-api-url.com
```

**Note**: Replace `your_api_key_here` and `https://your-api-url.com` with your actual credentials.

---

## Managing Your MCP Server

### List All MCP Servers

```bash
claude mcp list
```

### Remove MCP Server

```bash
claude mcp remove indian-stock-market
```

### Update MCP Server

To update environment variables or settings:

```bash
claude mcp remove indian-stock-market
claude mcp add indian-stock-market
# Then re-enter your settings
```

---

## Where Are Your API Credentials?

If you're not sure what your API key and base URL are, check:

1. **Parent directory `.env` file**:
   ```bash
   cat /Users/aswin/Documents/Projects/trade-assist/.env
   ```

2. **This directory's `.env` file**:
   ```bash
   cat /Users/aswin/Documents/Projects/trade-assist/mcp-server/.env
   ```

3. **Your API provider dashboard** (if applicable)

---

## Troubleshooting

### "Command not found: claude"

The `claude` CLI might not be installed or in your PATH. In this case:

1. Use the manual method (edit `claude_desktop_config.json` directly)
2. See the main README.md for manual installation instructions

### "MCP server not appearing"

1. Make sure you restarted Claude Code completely
2. Check the config file was updated:
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```
3. Look for errors in Claude Code logs

### "Cannot connect to MCP server"

1. Verify the script path is correct and absolute
2. Test the server manually: `node index.js`
3. Check your API credentials are correct
4. Ensure `node_modules` are installed (`npm install`)

### Wrong API credentials

Remove and re-add the server with correct credentials:

```bash
claude mcp remove indian-stock-market
claude mcp add indian-stock-market
# Re-enter correct credentials
```

---

## What Gets Added to Config?

The `claude mcp add` command updates your Claude Code configuration file:

**Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/claude-code/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Content added**:
```json
{
  "mcpServers": {
    "indian-stock-market": {
      "command": "node",
      "args": [
        "/Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js"
      ],
      "env": {
        "INDIAN_STOCK_API_KEY": "your_api_key",
        "INDIAN_STOCK_API_BASE_URL": "https://your-api-url.com"
      }
    }
  }
}
```

---

## Security Note

When using `claude mcp add`, your API credentials are stored in plain text in the Claude Code configuration file.

**Alternatives for better security**:

1. **Use .env file** (recommended):
   - Store credentials in `mcp-server/.env`
   - The `index.js` loads them with `dotenv`
   - Don't pass credentials via `--env` flag

2. **Environment variables**:
   - Set system environment variables
   - Don't include in config file

To use `.env` file method:

```bash
# Create .env file first
echo "INDIAN_STOCK_API_KEY=your_key" > .env
echo "INDIAN_STOCK_API_BASE_URL=https://your-url.com" >> .env

# Then add MCP without env vars
claude mcp add indian-stock-market \
  --type node \
  --command /Users/aswin/Documents/Projects/trade-assist/mcp-server/index.js
```

The `index.js` will automatically load from `.env` file.

---

## Success!

Once installed, you can:

✅ Ask Claude about any Indian stock
✅ Get real-time market data in conversations
✅ Analyze portfolios with live data
✅ Screen stocks by sector/industry
✅ Track market trends and news

**Example queries**:
- "Get me details for Reliance Industries"
- "What are the trending stocks today?"
- "Show me the most active NSE stocks"
- "Get historical data for TCS over the last year"
- "Find all banking stocks and their P/E ratios"

Enjoy seamless market data access in Claude Code! 🚀
