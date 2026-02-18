# Changelog

## [1.1.0] - 2026-02-18

### Changed
- Upgrade MCP SDK from v0.5 to v1.26 (`McpServer` + `registerTool` API with Zod schema validation)
- Publish as npm package — install via `npx -y indian-stock-market-mcp`
- Add multi-client setup docs (Claude Desktop, Claude Code, Cursor, Windsurf)
- Add `bin` entry for direct `npx` execution
- Remove `dotenv` and `nodemon` dependencies
- Consolidate docs into a single README

### Removed
- INSTALL.md, QUICKSTART.md, COMMANDS.md, SUMMARY.md (consolidated into README)
- setup.sh, install-one-click.sh (obsolete with npx)
- claude-config-template.json (config examples in README)

## [1.0.1] - 2025-10-27

### Fixed
- **Response Size Management**: Added intelligent filtering and truncation to prevent token limit errors
  - Stock details now return only essential fields
  - List responses limited to top 20 items
  - Historical data limited to last 100 data points
  - Financial statements limited to 10 items per array
  - News/announcements limited to 15 items with 300-char descriptions
  - Automatic fallback to summary view if response exceeds 20,000 tokens

## [1.0.0] - 2025-10-27

### Added
- Initial release with 15 stock market tools
- Error handling with 30-second timeout
- API key rotation on rate limits
- Environment variable support for API credentials
