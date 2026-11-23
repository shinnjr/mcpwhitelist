# Open Agent Safety Registry & MCP Whitelist (`mcpwhitelist`)

[![MCPWhitelist Verified](https://mcpwhitelist.com/v1/badge/gh-claude-code.svg)](https://mcpwhitelist.com/agent/gh-claude-code)

**Vendor-neutral, open-source safety registry, STDIO MCP server, SHA-512 lockfile compiler, and 24/7 supply-chain malware scanner for AI agents and MCP servers.**

- **Main Registry:** https://agentwhitelist.com
- **MCP Tool Gate & Lockfiles:** https://mcpwhitelist.com
- **State of A2A & MCP Readiness Leaderboard:** https://agentwhitelist.com/a2a-leaderboard
- **100% Free Open Threat Feeds (CSV & JSON):** https://agentwhitelist.com/open-data
- **Neutral Governance & Grants:** https://agentwhitelist.com/governance
- **Report Malware / Appeal Flag:** https://agentwhitelist.com/dispute

## Instant Zero-Account Install (Node & Python Directly From GitHub)

Run directly with zero registry account setup:

```bash
# Node.js CLI & lockfile verification
npx --yes github:shinnjr/mcpwhitelist --help
npx --yes github:shinnjr/mcpwhitelist --badge gh-claude-code

# Python CLI via uvx or pip
uvx --from git+https://github.com/shinnjr/mcpwhitelist.git mcpwhitelist --check claude-code
pip install git+https://github.com/shinnjr/mcpwhitelist.git
```

Prebuilt `.whl`, `.tar.gz`, and `.tgz` release archives are attached on every [GitHub Release](https://github.com/shinnjr/mcpwhitelist/releases).

## STDIO MCP Server Configuration (Claude Desktop / Cursor / Cline)

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

Or run the zero-dependency Python STDIO server (`uvx --from git+https://github.com/shinnjr/mcpwhitelist.git mcpwhitelist --mcp`) or connect directly via Streamable HTTP MCP at `https://mcpwhitelist.com/mcp`.

## Reusable GitHub Composite Action (`action.yml`)

Gate pull requests touching `mcp.json` or lockfiles automatically using `./action.yml` in CI workflows.

## Free Public APIs (Zero Auth Required)

- **Audit any npm/PyPI package or agent:** `GET https://agentwhitelist.com/v1/check?q=<name>`
- **Audit any domain A2A Agent Card / MCP JSON:** `GET https://agentwhitelist.com/v1/scan-domain?domain=cloudflare.com`
- **Submit & live-audit any package:** `POST https://agentwhitelist.com/v1/public/submit`
- **Download confirmed malware & install-hook CSV:** `GET https://agentwhitelist.com/v1/public/threats.csv`
- **Download confirmed malware & CVE JSON:** `GET https://agentwhitelist.com/v1/public/threats.json`
- **Live crawler & category telemetry:** `GET https://agentwhitelist.com/v1/public/summary.json`

## Governance & License

Licensed under the **MIT License**. See [OPEN_GOVERNANCE.md](./OPEN_GOVERNANCE.md) and [SECURITY.md](./SECURITY.md) for our zero-conflict independence charter and public dispute process.
