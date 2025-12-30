import socket
import ssl
from typing import Any, Dict, List


WEAK_CIPHERS = [
    "RC4-SHA",
    "DES-CBC3-SHA",
    "ECDHE-RSA-DES-CBC3-SHA",
    "AES128-SHA",
]


def _try_cipher(domain: str, cipher: str) -> Dict[str, Any]:
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    try:
        context.set_ciphers(cipher)
    except ssl.SSLError as exc:
        return {"supported": False, "error": str(exc)}

    try:
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                return {"supported": True, "cipher": ssock.cipher()[0]}
    except Exception as exc:
        return {"supported": False, "error": str(exc)}


def scan_tls_ciphers(domain: str) -> Dict[str, Any]:
    results = {}
    supported = []
    for cipher in WEAK_CIPHERS:
        res = _try_cipher(domain, cipher)
        results[cipher] = res
        if res.get("supported"):
            supported.append(cipher)

    return {
        "weak_ciphers_supported": supported,
        "results": results,
    }
