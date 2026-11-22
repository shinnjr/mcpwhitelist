"""Zero-dependency CLI & STDIO MCP server for mcpwhitelist.com and agentwhitelist.com."""
import argparse
import json
import sys
import urllib.parse
import urllib.request

DEFAULT_HOST = "mcpwhitelist.com"
USER_AGENT = "mcpwhitelist-py/1.1.0"


def badge_markdown(slug: str, host: str = DEFAULT_HOST) -> str:
    clean = urllib.parse.quote(str(slug).strip(), safe="")
    return f"[![MCPWhitelist Verified](https://{host}/v1/badge/{clean}.svg)](https://{host}/agent/{clean})"


def check_server(query: str, host: str = DEFAULT_HOST, timeout: float = 12.0) -> dict:
    url = f"https://{host}/v1/check?q={urllib.parse.quote(str(query).strip(), safe='')}"
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def scan_config(config_obj: dict, host: str = DEFAULT_HOST, timeout: float = 15.0) -> dict:
    url = f"https://{host}/v1/lockfile"
    body = json.dumps(config_obj).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json", "Accept": "application/json", "User-Agent": USER_AGENT},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def handle_mcp_message(msg: dict, host: str = DEFAULT_HOST):
    msg_id = msg.get("id")
    method = msg.get("method")
    if method in ("notifications/initialized", "notifications/cancelled"):
        return None
    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": msg_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "serverInfo": {"name": "mcpwhitelist-py", "version": "1.1.0"},
                "capabilities": {"tools": {}},
            },
        }
    if method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": msg_id,
            "result": {
                "tools": [
                    {
                        "name": "check_mcp_server",
                        "description": "Audit an MCP server or AI package for SHA-512 integrity, lifecycle hooks, and CISO verdict.",
                        "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]},
                    },
                    {
                        "name": "scan_mcp_config",
                        "description": "Scan a Claude Desktop or Cursor mcpServers JSON config and build a SHA-512 mcp-lock.json.",
                        "inputSchema": {"type": "object", "properties": {"mcpServers": {"type": "object"}}, "required": ["mcpServers"]},
                    },
                ]
            },
        }
    if method == "tools/call":
        params = msg.get("params") or {}
        name = params.get("name")
        args = params.get("arguments") or {}
        if name == "check_mcp_server":
            out = check_server(args.get("query", ""), host=host)
            return {"jsonrpc": "2.0", "id": msg_id, "result": {"content": [{"type": "text", "text": json.dumps(out)}]}}
        if name == "scan_mcp_config":
            out = scan_config({"mcpServers": args.get("mcpServers") or {}}, host=host)
            return {"jsonrpc": "2.0", "id": msg_id, "result": {"content": [{"type": "text", "text": json.dumps(out)}]}}
    if msg_id is not None:
        return {"jsonrpc": "2.0", "id": msg_id, "error": {"code": -32601, "message": "Method not found"}}
    return None


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Verify MCP servers and compile SHA-512 mcp-lock.json lockfiles via mcpwhitelist.com.")
    parser.add_argument("--check", metavar="QUERY", help="Check a package, GitHub repo, or MCP server slug")
    parser.add_argument("--config", metavar="PATH", help="Path to Claude Desktop or Cursor mcp.json")
    parser.add_argument("--write-lockfile", action="store_true", help="Write mcp-lock.json after scanning --config")
    parser.add_argument("--badge", metavar="SLUG", help="Print README verification badge Markdown")
    parser.add_argument("--mcp", action="store_true", help="Run as a local STDIO MCP JSON-RPC server")
    parser.add_argument("--host", default=DEFAULT_HOST, help="Registry host (default: mcpwhitelist.com)")
    args = parser.parse_args(argv)

    if args.mcp:
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            try:
                reply = handle_mcp_message(json.loads(line), host=args.host)
                if reply is not None:
                    sys.stdout.write(json.dumps(reply) + "\n")
                    sys.stdout.flush()
            except Exception as exc:
                sys.stdout.write(json.dumps({"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": str(exc)}}) + "\n")
                sys.stdout.flush()
        return 0

    if args.badge:
        print(badge_markdown(args.badge, host=args.host))
        return 0

    if args.check:
        print(json.dumps(check_server(args.check, host=args.host), indent=2))
        return 0

    if args.config:
        with open(args.config, "r", encoding="utf-8") as fh:
            payload = json.load(fh)
        report = scan_config(payload, host=args.host)
        print(json.dumps(report, indent=2))
        if args.write_lockfile and isinstance(report, dict) and report.get("lockfile"):
            with open("mcp-lock.json", "w", encoding="utf-8") as out_fh:
                json.dump(report["lockfile"], out_fh, indent=2)
                out_fh.write("\n")
        return 0

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
