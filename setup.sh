#!/bin/bash

echo "🚀 Setting up Indian Stock Market MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API credentials"
else
    echo "✅ .env file already exists"
fi

# Get Claude Code config path
CLAUDE_CONFIG_DIR="$HOME/.config/claude-code"
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

echo ""
echo "📝 Claude Code Configuration"
echo "================================"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    CLAUDE_CONFIG_DIR="$APPDATA/Claude"
    CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
fi

echo "Claude Code config location: $CLAUDE_CONFIG_FILE"

# Create config directory if it doesn't exist
mkdir -p "$CLAUDE_CONFIG_DIR"

# Get current directory
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "Add the following to your Claude Code config:"
echo "($CLAUDE_CONFIG_FILE)"
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
echo "        \"INDIAN_STOCK_API_BASE_URL\": \"https://YOUR_API_BASE_URL_HERE\""
echo "      }"
echo "    }"
echo "  }"
echo "}"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API credentials"
echo "2. Add the MCP server to Claude Code config (see above)"
echo "3. Restart Claude Code"
echo "4. Test with: npm start"
echo ""
echo "For detailed instructions, see README.md"
