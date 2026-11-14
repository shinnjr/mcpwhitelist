# mcpwhitelist

CLI and README badge generator backed by **[MCPWhitelist.com](https://mcpwhitelist.com)** and **[AgentWhitelist.com](https://agentwhitelist.com)**.

- Pin every `npx` or `uvx` MCP server to verified SHA-512 tarballs via `mcp-lock.json`
- Detect npm `preinstall` / `postinstall` hooks before secrets leave your machine
- Embed live audit verification badges in any repository README:

```markdown
[![MCPWhitelist Verified](https://mcpwhitelist.com/v1/badge/modelcontextprotocol-server-filesystem.svg)](https://mcpwhitelist.com/agent/modelcontextprotocol-server-filesystem)
```

## Quick Start

```bash
node bin/mcpwhitelist.mjs --config mcp.json --write-lockfile
node bin/mcpwhitelist.mjs --badge modelcontextprotocol-server-filesystem
```
