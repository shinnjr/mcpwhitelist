# Open Governance & Neutrality Charter — Open Agent Safety Registry

**Live Registry:** [agentwhitelist.com](https://agentwhitelist.com) | [mcpwhitelist.com](https://mcpwhitelist.com) | [washfilter.com](https://washfilter.com)
**Live Governance Page:** https://agentwhitelist.com/governance
**Free Open Threat Feeds:** https://agentwhitelist.com/open-data

## 1. Mission
The **Open Agent Safety Registry** is an independent, vendor-neutral public safety watchdog for AI agents, Model Context Protocol (MCP) servers, HuggingFace models/spaces, and autonomous software packages.

While commercial cloud providers and proprietary marketplaces gate directories behind vendor lock-in, we operate an open, continuous supply-chain auditing infrastructure (running 24/7 in Cloudflare Workers + D1) to protect developers, researchers, and organizations from:
- Confirmed malicious packages (ingested from unthrottled OSV.dev malware feeds & GitHub Advisory Database)
- Hidden `preinstall` / `install` / `postinstall` and `setup.py` `sdist` shell execution traps
- Unpinned version drift & missing cryptographic SHA-512 / SHA-256 integrity digests
- Unverified AI domain discovery endpoints (`/.well-known/agent-card.json`, `/.well-known/mcp.json`, `/llms.txt`)
- Fake-review and multi-wallet sybil wash rings

## 2. Zero-Conflict Independence Rules
1. **Zero Pay-to-Play:** Software vendors, package maintainers, and sponsors can **never** pay to remove a confirmed malware, CVE, or install-hook warning.
2. **Free Public Safety Feeds:** All confirmed malware/CVE blocks and install-hook catches are published free with zero paywall at `/v1/public/threats.csv`, `/v1/public/threats.json`, `/v1/public/a2a-domains.json`, `/v1/public/summary.json`, and `/drift.xml`.
3. **Reproducible Verdicts:** Every verdict is pinned to an exact version, cryptographic tarball digest, OSV advisory ID, or public ledger receipt.
4. **Transparent Appeals & Re-Audits:** Maintainers who patch a vulnerability or remove an install trap can request an immediate automated re-audit at https://agentwhitelist.com/dispute.

## 3. Nonprofit & Fiscal Sponsorship Transition
This project is actively transitioning from founder-seeded cloud infrastructure into neutral nonprofit governance via an established tax-exempt open-source fiscal sponsor (such as Open Source Collective). Grants and community funding go strictly toward public security compute, automated OSV/registry auditing, and open-source CLI/tooling maintenance under the MIT License.
