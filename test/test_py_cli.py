import io
import json
import unittest
from unittest.mock import patch

from mcpwhitelist.cli import badge_markdown, check_server, handle_mcp_message, scan_config


class FakeResp(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False


class TestMcpWhitelistPy(unittest.TestCase):
    def test_badge_markdown(self):
        md = badge_markdown("gh-claude-code")
        self.assertIn("https://mcpwhitelist.com/v1/badge/gh-claude-code.svg", md)
        self.assertIn("https://mcpwhitelist.com/agent/gh-claude-code", md)

    def test_mcp_protocol_handlers(self):
        init_res = handle_mcp_message({"jsonrpc": "2.0", "id": 1, "method": "initialize"})
        self.assertEqual(init_res["result"]["serverInfo"]["name"], "mcpwhitelist-py")
        list_res = handle_mcp_message({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
        self.assertEqual(len(list_res["result"]["tools"]), 2)
        self.assertIsNone(handle_mcp_message({"jsonrpc": "2.0", "method": "notifications/initialized"}))

    def test_mocked_check_and_scan(self):
        with patch("urllib.request.urlopen", return_value=FakeResp(b'{"verdict":"GO","trust_points":95}')):
            out = check_server("claude-code")
            self.assertEqual(out["verdict"], "GO")
        with patch("urllib.request.urlopen", return_value=FakeResp(b'{"ok":true,"lockfile":{"version":1}}')):
            out = scan_config({"mcpServers": {}})
            self.assertTrue(out["ok"])


if __name__ == "__main__":
    unittest.main()
