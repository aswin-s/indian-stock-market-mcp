#!/bin/bash

echo "Setting up Indian Stock Market MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js $(node --version) found"

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo "Dependencies installed"

# Check for .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env and add your API credentials"
else
    echo ".env file already exists"
fi

# Get current directory (where index.js lives)
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "Claude Code Configuration"
echo "================================"
echo ""
echo "Option 1: Using Claude CLI (Recommended)"
echo ""
echo "  claude mcp add indian-stock-market -s user -- node $CURRENT_DIR/index.js"
echo ""
echo "  Then set environment variables separately in .env or pass them via --env flags."
echo ""
echo "Option 2: Manual Configuration"
echo ""
echo "  Add the following to your Claude Desktop config file:"
echo ""

# Detect OS for config path hint
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "  Linux: ~/.config/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "  Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
fi

echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"indian-stock-market\": {"
echo "      \"command\": \"node\","
echo "      \"args\": ["
echo "        \"$CURRENT_DIR/index.js\""
echo "      ],"
echo "      \"env\": {"
echo "        \"INDIAN_STOCK_API_KEY\": \"YOUR_API_KEY_HERE\","
echo "        \"INDIAN_STOCK_API_BASE_URL\": \"YOUR_API_BASE_URL_HERE\""
echo "      }"
echo "    }"
echo "  }"
echo "}"
echo ""

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API credentials"
echo "2. Add the MCP server to Claude using one of the options above"
echo "3. Restart Claude Desktop / Claude Code"
echo "4. Test with: npm start"
echo ""
echo "For detailed instructions, see README.md"
