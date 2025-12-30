import dns.resolver
from typing import Any, Dict


def check_dnssec(domain: str) -> Dict[str, Any]:
    result = {"enabled": False, "dnskey": False, "ds": False, "error": None}

    try:
        dns.resolver.resolve(domain, "DNSKEY", lifetime=3)
        result["dnskey"] = True
    except Exception:
        result["dnskey"] = False

    # Try DS lookup on parent zone (best effort)
    try:
        parent = ".".join(domain.split(".")[1:])
        if parent:
            dns.resolver.resolve(domain, "DS", lifetime=3)
            result["ds"] = True
    except Exception:
        result["ds"] = False

    result["enabled"] = result["dnskey"] and result["ds"]
    return result
