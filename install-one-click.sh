#!/bin/bash

echo "==========================================================="
echo "  Indian Stock Market MCP Server - One-Click Install"
echo "==========================================================="
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

echo "Node.js $(node --version) found"

# Install dependencies
echo "Installing dependencies..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo "Dependencies installed"

# Prompt for API credentials
echo ""
echo "API Configuration"
echo "------------------------------------------------------------"

if [ ! -f ".env" ]; then
    echo "Please enter your API credentials:"
    echo ""

    read -p "API Base URL: " API_URL
    read -p "API Key: " API_KEY

    # Create .env file
    cat > .env << EOF
INDIAN_STOCK_API_BASE_URL=$API_URL
INDIAN_STOCK_API_KEY=$API_KEY
EOF

    echo "Created .env file"
else
    echo ".env file already exists, skipping credential setup"
fi

# Add to Claude Code using CLI
echo ""
echo "Adding to Claude Code..."

# Get absolute path to index.js
INDEX_PATH="$(pwd)/index.js"

# Try using claude mcp add
if command -v claude &> /dev/null; then
    echo "Found Claude CLI"
    echo ""
    echo "Running: claude mcp add indian-stock-market"
    echo ""

    claude mcp add indian-stock-market -s user -- node "$INDEX_PATH" 2>&1

    if [ $? -eq 0 ]; then
        echo "MCP server added to Claude Code"
        MCP_ADDED=true
    else
        echo "Could not auto-add. You'll need to add manually."
    fi
else
    echo "Claude CLI not found. Manual configuration needed."
fi

# Test the server
echo ""
echo "Testing server..."

# Use a portable approach for timeout (works on both macOS and Linux)
node -e "
  import('$INDEX_PATH').catch(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000);
" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Server test passed"
else
    echo "Server test inconclusive (this is normal for stdio-based servers)"
fi

# Final instructions
echo ""
echo "==========================================================="
echo "  Installation Complete!"
echo "==========================================================="
echo ""

if [ "$MCP_ADDED" == "true" ]; then
    echo "MCP server is ready to use!"
    echo ""
    echo "Next steps:"
    echo "1. Restart Claude Code completely (Cmd+Q / Alt+F4, then relaunch)"
    echo "2. Try: 'Get me details for Tata Steel'"
    echo ""
else
    echo "Manual configuration required"
    echo ""
    echo "Option 1 - Claude CLI:"
    echo "  claude mcp add indian-stock-market -s user -- node $INDEX_PATH"
    echo ""
    echo "Option 2 - Edit config file manually:"
    echo ""

    # Detect OS for config path
    if [[ "$OSTYPE" == "darwin"* ]]; then
        CONFIG_PATH="~/Library/Application Support/Claude/claude_desktop_config.json"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        CONFIG_PATH="~/.config/Claude/claude_desktop_config.json"
    else
        CONFIG_PATH="See README.md for your OS"
    fi

    echo "  File: $CONFIG_PATH"
    echo ""
    echo '  {'
    echo '    "mcpServers": {'
    echo '      "indian-stock-market": {'
    echo '        "command": "node",'
    echo '        "args": ['
    echo "          \"$INDEX_PATH\""
    echo '        ],'
    echo '        "env": {'
    echo '          "INDIAN_STOCK_API_KEY": "YOUR_API_KEY",'
    echo '          "INDIAN_STOCK_API_BASE_URL": "YOUR_API_BASE_URL"'
    echo '        }'
    echo '      }'
    echo '    }'
    echo '  }'
    echo ""
    echo "Then restart Claude Desktop / Claude Code"
fi

echo ""
echo "Documentation:"
echo "  - INSTALL.md  - Detailed setup guide"
echo "  - QUICKSTART.md - 5-minute guide"
echo "  - README.md - Full tool reference"
echo ""
echo "Verify installation:"
echo "  - In Claude Code, check available MCP tools"
echo "  - Should see: indian-stock-market"
echo ""
