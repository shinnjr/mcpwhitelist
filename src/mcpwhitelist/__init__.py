"""MCPWhitelist Python client, CLI, and STDIO MCP server (zero dependencies)."""
__version__ = "1.2.0"
from .cli import badge_markdown, check_server, handle_mcp_message, scan_config

__all__ = [
    "badge_markdown",
    "check_server",
    "handle_mcp_message",
    "scan_config",
    "__version__",
]
