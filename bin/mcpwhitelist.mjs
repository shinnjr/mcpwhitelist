#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

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

export async function checkServerTrust(query, host = "mcpwhitelist.com", fetchImpl = fetch) {
  const res = await fetchImpl(`https://${host}/v1/check?q=${encodeURIComponent(String(query || ""))}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Check HTTP ${res.status}`);
  return res.json();
}

export async function handleMcpMessage(msg, fetchImpl = fetch) {
  const id = msg?.id ?? null;
  if (msg?.method === "notifications/initialized" || msg?.method === "notifications/cancelled") {
    return null;
  }
  if (msg?.method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "mcpwhitelist", version: "1.1.0" },
        capabilities: { tools: {} },
      },
    };
  }
  if (msg?.method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "check_mcp_server",
            description: "Check an MCP server, npm package, or GitHub repo for SHA-512 integrity, lifecycle hooks, and CISO verdict.",
            inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
          },
          {
            name: "scan_mcp_config",
            description: "Scan a Claude Desktop or Cursor mcpServers JSON config and generate a pinned mcp-lock.json digest.",
            inputSchema: { type: "object", properties: { mcpServers: { type: "object" } }, required: ["mcpServers"] },
          },
        ],
      },
    };
  }
  if (msg?.method === "tools/call") {
    const name = msg?.params?.name;
    const args = msg?.params?.arguments || {};
    if (name === "check_mcp_server") {
      const data = await checkServerTrust(args.query, "mcpwhitelist.com", fetchImpl);
      return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data) }] } };
    }
    if (name === "scan_mcp_config") {
      const data = await scanWithRegistry({ mcpServers: args.mcpServers || {} }, "https://mcpwhitelist.com/v1/lockfile", fetchImpl);
      return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data) }] } };
    }
  }
  return id !== null ? { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } } : null;
}

async function runStdioServer() {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const msg = JSON.parse(trimmed);
      const reply = await handleMcpMessage(msg);
      if (reply) process.stdout.write(JSON.stringify(reply) + "\n");
    } catch (err) {
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: err.message } }) + "\n");
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: mcpwhitelist [--mcp] [--config mcp.json] [--write-lockfile] [--badge <slug>]");
    process.exit(0);
  }
  if (args.includes("--mcp") || (args.length === 0 && !process.stdin.isTTY)) {
    await runStdioServer();
    return;
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
