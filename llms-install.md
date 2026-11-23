# Installing MCPWhitelist in Cline, Cursor, or Claude Desktop

Zero external secrets or API keys are required for public verification lookups.

## Option 1: Remote Streamable HTTP MCP (No Local Process Required)

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

## Option 2: 1-Line Node.js STDIO MCP Server (`npx` Directly From GitHub)

Requires Node.js 18+:

```json
{
  "mcpServers": {
    "mcpwhitelist": {
      "command": "npx",
      "args": ["--yes", "github:shinnjr/mcpwhitelist", "--mcp"]
    }
  }
}
```

## Option 3: 1-Line Python STDIO MCP Server (`uvx` / `pip`)

```json
{
  "mcpServers": {
    "mcpwhitelist": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/shinnjr/mcpwhitelist.git", "mcpwhitelist", "--mcp"]
    }
  }
}
```

## Tools Exposed

1. `check_mcp_server(query)` - Inspects SHA-512 integrity, install hooks, and CISO GO/NO-GO verdict.
2. `scan_mcp_config(mcpServers)` - Audits an entire MCP JSON config and generates a pinned `mcp-lock.json` manifest.
