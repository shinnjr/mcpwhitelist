#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

export function parseMcpPackages(configObj) {
  const servers = configObj?.mcpServers || {};
  const pkgs = [];
  for (const [name, cfg] of Object.entries(servers)) {
    const cmd = String(cfg?.command || "");
    const args = Array.isArray(cfg?.args) ? cfg.args.map(String) : [];
    const target = args.find((a) => !a.startsWith("-")) || cmd;
    pkgs.push({ server: name, command: cmd, target, args });
  }
  return pkgs;
}

export function badgeMarkdown(slug, host = "mcpwhitelist.com") {
  const cleanSlug = encodeURIComponent(String(slug || "").trim());
  return `[![MCPWhitelist Verified](https://${host}/v1/badge/${cleanSlug}.svg)](https://${host}/agent/${cleanSlug})`;
}

export async function scanWithRegistry(configObj, endpoint = "https://mcpwhitelist.com/v1/lockfile", fetchImpl = fetch) {
  const res = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(configObj),
  });
  if (!res.ok) {
    throw new Error(`Registry HTTP ${res.status}`);
  }
  return res.json();
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: mcpwhitelist [--config mcp.json] [--write-lockfile] [--badge <slug>]");
    process.exit(0);
  }
  const badgeIdx = args.indexOf("--badge");
  if (badgeIdx !== -1 && args[badgeIdx + 1]) {
    console.log(badgeMarkdown(args[badgeIdx + 1]));
    process.exit(0);
  }
  const cfgIdx = args.indexOf("--config");
  const cfgPath = path.resolve(cfgIdx !== -1 && args[cfgIdx + 1] ? args[cfgIdx + 1] : "mcp.json");
  if (!fs.existsSync(cfgPath)) {
    console.error(`Config file not found: ${cfgPath}`);
    process.exit(1);
  }
  const payload = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const report = await scanWithRegistry(payload);
  console.log(JSON.stringify(report, null, 2));
  if (args.includes("--write-lockfile") && report?.lockfile) {
    fs.writeFileSync("mcp-lock.json", JSON.stringify(report.lockfile, null, 2) + "\n");
    console.error("Wrote mcp-lock.json");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
