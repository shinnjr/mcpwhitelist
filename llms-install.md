# Installing MCPWhitelist in Cline, Cursor, or Claude Desktop

Zero external secrets or API keys are required for public verification lookups.

## Option 1: Remote Streamable HTTP MCP (No Local Process Required)

Connect directly to the hosted Streamable HTTP endpoint:

- URL: `https://mcpwhitelist.com/mcp`

```json
{
  "mcpServers": {
    "mcpwhitelist": {
      "url": "https://mcpwhitelist.com/mcp"
    }
  }
}
```

## Option 2: Local Node.js STDIO MCP Server

Requires Node.js 18+:

```bash
git clone https://github.com/shinnjr/mcpwhitelist.git
cd mcpwhitelist
node bin/mcpwhitelist.mjs --mcp
```

Add to `cline_mcp_settings.json`, `claude_desktop_config.json`, or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mcpwhitelist": {
      "command": "node",
      "args": ["/path/to/mcpwhitelist/bin/mcpwhitelist.mjs", "--mcp"]
    }
  }
}
```

## Tools Exposed

1. `check_mcp_server(query)` - Inspects SHA-512 integrity, install hooks, and CISO GO/NO-GO verdict.
2. `scan_mcp_config(mcpServers)` - Audits an entire MCP JSON config and generates a pinned `mcp-lock.json` manifest.
