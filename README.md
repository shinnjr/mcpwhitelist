# Open Agent Safety Registry & MCP Whitelist (`mcpwhitelist`)

**Vendor-neutral, open-source safety registry, SHA-512 lockfile compiler, and 24/7 supply-chain malware scanner for AI agents and MCP servers.**

- **Main Registry:** https://agentwhitelist.com
- **MCP Tool Gate & Lockfiles:** https://mcpwhitelist.com
- **State of A2A & MCP Readiness Leaderboard:** https://agentwhitelist.com/a2a-leaderboard
- **100% Free Open Threat Feeds (CSV & JSON):** https://agentwhitelist.com/open-data
- **Neutral Governance & Grants:** https://agentwhitelist.com/governance
- **Report Malware / Appeal Flag:** https://agentwhitelist.com/dispute

## 1-Line Zero-Secret Config Scanner & SHA-512 Lockfile Generator

```bash
curl -fsSL https://mcpwhitelist.com/cli.mjs | node - --write-lockfile
```

Or run the CLI directly from this repository (`bin/`):
```bash
npx mcpwhitelist --write-lockfile
```

## Free Public APIs (Zero Auth Required)

- **Audit any npm/PyPI package or agent:** `GET https://agentwhitelist.com/v1/check?q=<name>`
- **Audit any domain A2A Agent Card / MCP JSON:** `GET https://agentwhitelist.com/v1/scan-domain?domain=cloudflare.com`
- **Submit & live-audit any package:** `POST https://agentwhitelist.com/v1/public/submit`
- **Download confirmed malware & install-hook CSV:** `GET https://agentwhitelist.com/v1/public/threats.csv`
- **Download confirmed malware & CVE JSON:** `GET https://agentwhitelist.com/v1/public/threats.json`
- **Live crawler & category telemetry:** `GET https://agentwhitelist.com/v1/public/summary.json`

## Governance & License
Licensed under the **MIT License**. See [OPEN_GOVERNANCE.md](./OPEN_GOVERNANCE.md) and [SECURITY.md](./SECURITY.md) for our zero-conflict independence charter and public dispute process.
