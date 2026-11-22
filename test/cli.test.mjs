import test from "node:test";
import assert from "node:assert/strict";
import { parseMcpPackages, badgeMarkdown, scanWithRegistry, handleMcpMessage } from "../bin/mcpwhitelist.mjs";

test("parseMcpPackages extracts packages without reading env secrets", () => {
  const pkgs = parseMcpPackages({
    mcpServers: {
      fs: { command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem"], env: { SECRET: "hidden" } },
    },
  });
  assert.equal(pkgs.length, 1);
  assert.equal(pkgs[0].target, "@modelcontextprotocol/server-filesystem");
  assert.equal(JSON.stringify(pkgs).includes("hidden"), false);
});

test("badgeMarkdown generates clean README embed pointing to mcpwhitelist.com", () => {
  const md = badgeMarkdown("modelcontextprotocol-server-filesystem");
  assert.match(md, /https:\/\/mcpwhitelist\.com\/v1\/badge\//);
  assert.match(md, /https:\/\/mcpwhitelist\.com\/agent\//);
});

test("scanWithRegistry calls POST /v1/lockfile and parses response", async () => {
  const fakeFetch = async (url, init) => {
    assert.equal(url, "https://mcpwhitelist.com/v1/lockfile");
    assert.equal(init.method, "POST");
    return new Response(JSON.stringify({ ok: true, checked: 1 }), { status: 200 });
  };
  const out = await scanWithRegistry({ mcpServers: {} }, undefined, fakeFetch);
  assert.equal(out.ok, true);
});

test("handleMcpMessage supports STDIO MCP initialize, tools/list, and check_mcp_server", async () => {
  const initRes = await handleMcpMessage({ jsonrpc: "2.0", id: 1, method: "initialize" });
  assert.equal(initRes.result.serverInfo.name, "mcpwhitelist");
  const listRes = await handleMcpMessage({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  assert.equal(listRes.result.tools.length, 2);
  const notif = await handleMcpMessage({ jsonrpc: "2.0", method: "notifications/initialized" });
  assert.equal(notif, null);

  const fakeFetch = async (url) => {
    assert.match(url, /https:\/\/mcpwhitelist\.com\/v1\/check\?q=claude-code/);
    return new Response(JSON.stringify({ verdict: "GO", trust_points: 95 }), { status: 200 });
  };
  const callRes = await handleMcpMessage(
    { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "check_mcp_server", arguments: { query: "claude-code" } } },
    fakeFetch
  );
  assert.match(callRes.result.content[0].text, /"verdict":"GO"/);
});
