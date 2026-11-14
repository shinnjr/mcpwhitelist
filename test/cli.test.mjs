import test from "node:test";
import assert from "node:assert/strict";
import { parseMcpPackages, badgeMarkdown, scanWithRegistry } from "../bin/mcpwhitelist.mjs";

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
