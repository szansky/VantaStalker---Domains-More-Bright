import socket
import ssl
from typing import Any, Dict, List


def _try_version(host: str, version: ssl.TLSVersion) -> Dict[str, Any]:
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    context.minimum_version = version
    context.maximum_version = version

    try:
        with socket.create_connection((host, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=host) as ssock:
                cipher = ssock.cipher()
                return {
                    "supported": True,
                    "cipher": cipher[0] if cipher else None,
                }
    except Exception as exc:
        return {"supported": False, "error": str(exc)}


def scan_tls_versions(domain: str) -> Dict[str, Any]:
    versions = []
    results = {}
    if hasattr(ssl, "TLSVersion"):
        versions = [
            ssl.TLSVersion.TLSv1,
            ssl.TLSVersion.TLSv1_1,
            ssl.TLSVersion.TLSv1_2,
            ssl.TLSVersion.TLSv1_3,
        ]

    for version in versions:
        label = str(version).replace("TLSVersion.", "")
        results[label] = _try_version(domain, version)

    supported = [v for v, data in results.items() if data.get("supported")]
    weak = [v for v in supported if v in ("TLSv1", "TLSv1_1")]

    issues = []
    if weak:
        issues.append(f"Weak TLS versions enabled: {', '.join(weak)}")
    if not supported:
        issues.append("No supported TLS versions detected on port 443.")

    return {
        "supported_versions": supported,
        "results": results,
        "issues": issues,
    }
