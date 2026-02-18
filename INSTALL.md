# Installing with Claude MCP CLI

This guide shows you how to add the Indian Stock Market MCP server using the `claude mcp add` command.

## Prerequisites

1. Claude Code installed
2. Node.js 18+ installed
3. MCP server dependencies installed (`npm install` in this directory)
4. API credentials from [IndianAPI.in](https://indianapi.in/indian-stock-market) (subscribe to a plan to get your API key)

## Installation Steps

### Step 1: Install Dependencies

```bash
cd /path/to/indian-stock-market-mcp
npm install
```

### Step 2: Add MCP Server Using CLI

Open your terminal and run:

```bash
claude mcp add indian-stock-market -s user -- node /path/to/indian-stock-market-mcp/index.js
```

Replace `/path/to/indian-stock-market-mcp` with the actual absolute path where you cloned the repository.

### Step 3: Configure Environment Variables

Create a `.env` file with your API credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials from [IndianAPI.in](https://indianapi.in/indian-stock-market):

```env
INDIAN_STOCK_API_BASE_URL=https://your-api-base-url.com
INDIAN_STOCK_API_KEY=your_actual_api_key_here
```

Alternatively, you can pass environment variables when adding the server:

```bash
claude mcp add indian-stock-market -s user \
  -e INDIAN_STOCK_API_KEY=your_api_key_here \
  -e INDIAN_STOCK_API_BASE_URL=https://your-api-url.com \
  -- node /path/to/indian-stock-market-mcp/index.js
```

### Step 4: Restart Claude Code

Completely quit and restart Claude Code for changes to take effect:

- **macOS**: Cmd+Q, then relaunch
- **Windows**: Alt+F4, then relaunch
- **Linux**: Quit completely, then relaunch

### Step 5: Verify Installation

In Claude Code, check that the `indian-stock-market` MCP server is available and its tools are listed.

### Step 6: Test It!

Try asking Claude:

```
Get me the latest details for Tata Steel
```

Claude should automatically use the `get_stock_details` tool from your MCP server!

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
claude mcp add indian-stock-market -s user -- node /path/to/indian-stock-market-mcp/index.js
```

---

## Manual Configuration (Alternative)

If you prefer to edit the config file directly, add this to your Claude Desktop configuration:

**Config file locations:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "indian-stock-market": {
      "command": "node",
      "args": [
        "/absolute/path/to/indian-stock-market-mcp/index.js"
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

## Troubleshooting

### "Command not found: claude"

The `claude` CLI might not be installed or in your PATH. Use the manual configuration method above instead.

### "MCP server not appearing"

1. Make sure you restarted Claude completely
2. Verify the absolute path to `index.js` is correct
3. Check for errors by running `node index.js` manually

### "Cannot connect to MCP server"

1. Verify the script path is correct and absolute
2. Test the server manually: `node index.js`
3. Check your API credentials are correct
4. Ensure `node_modules` are installed (`npm install`)

### Wrong API credentials

Remove and re-add the server with correct credentials:

```bash
claude mcp remove indian-stock-market
claude mcp add indian-stock-market -s user -- node /path/to/indian-stock-market-mcp/index.js
```

---

## Security Note

When using `claude mcp add` with `-e` flags, your API credentials are stored in the Claude configuration file.

**For better security**, store credentials in the `.env` file instead:

```bash
# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Then add MCP without env vars
claude mcp add indian-stock-market -s user -- node /path/to/indian-stock-market-mcp/index.js
```

The server will automatically load credentials from the `.env` file.
