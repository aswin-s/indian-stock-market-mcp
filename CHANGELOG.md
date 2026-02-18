# Changelog

All notable changes to the Indian Stock Market MCP Server will be documented in this file.

## [1.0.1] - 2025-10-27

### Fixed
- **Response Size Management**: Added intelligent filtering and truncation to prevent token limit errors
  - Stock details now return only essential fields (price, market cap, P/E, volume, etc.)
  - List responses limited to top 20 items with key fields only
  - Historical data limited to last 100 data points
  - Financial statements limited to 10 items per array
  - News/announcements limited to 15 items with 300-char descriptions
  - Automatic fallback to summary view if response exceeds 20,000 tokens
  - **Fixes**: "MCP tool response exceeds maximum allowed tokens (25000)" error

### Technical Details
- Added `estimateTokens()` function for rough token counting
- Added `filterResponse()` function for tool-specific data filtering
- Added `truncateIfNeeded()` function for final size validation
- Max response size: 20,000 tokens (with 5,000 token safety buffer)

## [1.0.0] - 2025-10-27

### Added
- Initial release of Indian Stock Market MCP Server
- 15 comprehensive tools for market data access:
  - `get_stock_details` - Stock information and metrics
  - `get_historical_data` - Price history with multiple timeframes
  - `get_trending_stocks` - Market movers and trending stocks
  - `get_market_news` - Latest market news
  - `get_nse_most_active` - Most active NSE stocks
  - `get_bse_most_active` - Most active BSE stocks
  - `get_price_shockers` - Significant gainers/losers
  - `get_52_week_high_low` - Stocks at 52-week extremes
  - `get_ipo_data` - IPO information
  - `get_corporate_actions` - Dividends, bonuses, splits
  - `get_recent_announcements` - Company announcements
  - `get_financial_statement` - Income, balance sheet, cash flow
  - `get_stock_target_price` - Analyst price targets
  - `search_industry` - Find stocks by sector/industry
  - `get_commodities` - Commodity prices
- Comprehensive documentation:
  - README.md - Full documentation
  - INSTALL.md - Claude CLI installation guide
  - QUICKSTART.md - 5-minute setup
  - COMMANDS.md - Command reference
  - SUMMARY.md - Project overview
- Automated installation scripts:
  - `install-one-click.sh` - Automated installer
  - `setup.sh` - Manual setup helper
- Error handling with 30-second timeout
- Environment variable support for API credentials
- Test utilities (`test-server.js`)

### Security
- API credentials via environment variables
- HTTPS-only API requests
- API key sent via secure header (`x-api-key`)
