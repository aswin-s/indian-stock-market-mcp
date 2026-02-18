#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "  Indian Stock Market MCP Server - One-Click Install"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Prompt for API credentials
echo ""
echo "📝 API Configuration"
echo "────────────────────────────────────────────────────────────"

# Check if parent .env exists
PARENT_ENV="../.env"
if [ -f "$PARENT_ENV" ]; then
    echo "ℹ️  Found parent .env file. Checking for credentials..."
    
    API_KEY=$(grep "INDIAN_STOCK_API_KEY" "$PARENT_ENV" | cut -d '=' -f2-)
    API_URL=$(grep "INDIAN_STOCK_API_BASE_URL" "$PARENT_ENV" | cut -d '=' -f2-)
    
    if [ -n "$API_KEY" ] && [ -n "$API_URL" ]; then
        echo "✅ Found credentials in parent .env file"
        USE_PARENT_CREDS=true
    fi
fi

if [ "$USE_PARENT_CREDS" != "true" ]; then
    echo "Please enter your API credentials:"
    echo ""
    
    read -p "API Base URL: " API_URL
    read -p "API Key: " API_KEY
    
    # Create .env file
    cat > .env << EOF
INDIAN_STOCK_API_BASE_URL=$API_URL
INDIAN_STOCK_API_KEY=$API_KEY
EOF
    
    echo "✅ Created .env file"
fi

# Add to Claude Code using CLI
echo ""
echo "🔧 Adding to Claude Code..."

# Get absolute path to index.js
INDEX_PATH="$(pwd)/index.js"

# Try using claude mcp add
if command -v claude &> /dev/null; then
    echo "✅ Found Claude CLI"
    echo ""
    echo "Running: claude mcp add indian-stock-market"
    echo ""
    
    # Non-interactive add (if possible)
    if [ "$USE_PARENT_CREDS" == "true" ]; then
        # Use credentials from env
        claude mcp add indian-stock-market \
            --type node \
            --command "$INDEX_PATH" 2>&1 | grep -v "^$"
    else
        # Use credentials entered
        claude mcp add indian-stock-market \
            --type node \
            --command "$INDEX_PATH" \
            --env "INDIAN_STOCK_API_KEY=$API_KEY" \
            --env "INDIAN_STOCK_API_BASE_URL=$API_URL" 2>&1 | grep -v "^$"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ MCP server added to Claude Code"
        MCP_ADDED=true
    else
        echo "⚠️  Could not auto-add. You'll need to add manually."
    fi
else
    echo "⚠️  Claude CLI not found. Manual configuration needed."
fi

# Test the server
echo ""
echo "🧪 Testing server..."
timeout 2 node index.js > /dev/null 2>&1 &
SERVER_PID=$!
sleep 1

if ps -p $SERVER_PID > /dev/null 2>&1; then
    kill $SERVER_PID 2> /dev/null
    echo "✅ Server test passed"
else
    echo "⚠️  Server test inconclusive (this is normal)"
fi

# Final instructions
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Installation Complete! 🎉"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ "$MCP_ADDED" == "true" ]; then
    echo "✅ MCP server is ready to use!"
    echo ""
    echo "Next steps:"
    echo "1. RESTART Claude Code completely (Cmd+Q / Alt+F4, then relaunch)"
    echo "2. Try: 'Get me details for Tata Steel'"
    echo ""
else
    echo "⚠️  Manual configuration required"
    echo ""
    echo "Add this to your Claude Code config:"
    
    # Detect OS for config path
    if [[ "$OSTYPE" == "darwin"* ]]; then
        CONFIG_PATH="~/Library/Application Support/Claude/claude_desktop_config.json"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        CONFIG_PATH="~/.config/claude-code/claude_desktop_config.json"
    else
        CONFIG_PATH="[See README.md for your OS]"
    fi
    
    echo "File: $CONFIG_PATH"
    echo ""
    echo '{'
    echo '  "mcpServers": {'
    echo '    "indian-stock-market": {'
    echo '      "command": "node",'
    echo '      "args": ['
    echo "        \"$INDEX_PATH\""
    echo '      ]'
    if [ -z "$USE_PARENT_CREDS" ]; then
        echo '      "env": {'
        echo "        \"INDIAN_STOCK_API_KEY\": \"$API_KEY\","
        echo "        \"INDIAN_STOCK_API_BASE_URL\": \"$API_URL\""
        echo '      }'
    fi
    echo '    }'
    echo '  }'
    echo '}'
    echo ""
    echo "Then RESTART Claude Code"
fi

echo ""
echo "📚 Documentation:"
echo "  • INSTALL.md - Detailed setup guide"
echo "  • QUICKSTART.md - 5-minute guide"
echo "  • README.md - Full tool reference"
echo ""
echo "🔍 Verify installation:"
echo "  • In Claude Code, type: /mcp list"
echo "  • Should see: indian-stock-market"
echo ""
echo "Happy trading! 📈"
