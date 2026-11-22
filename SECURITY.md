# Security Policy & Malware Reporting

## Report Malicious AI Agent Packages or False Positives
- **Public Submission & Appeal Desk:** https://agentwhitelist.com/dispute (triggers immediate live OSV.dev + install-hook re-audit)
- **Live Package Audit API:** `POST https://agentwhitelist.com/v1/public/submit` (`{"ecosystem":"npm","target":"<pkg>"}`)
- **Live Domain A2A / MCP Audit:** `GET https://agentwhitelist.com/v1/scan-domain?domain=<host>`

## Free Open Threat Data
- **CSV Feed:** https://agentwhitelist.com/v1/public/threats.csv
- **JSON Feed:** https://agentwhitelist.com/v1/public/threats.json
- **Live RSS Alerts:** https://agentwhitelist.com/drift.xml
- **State of A2A Readiness Leaderboard:** https://agentwhitelist.com/a2a-leaderboard
