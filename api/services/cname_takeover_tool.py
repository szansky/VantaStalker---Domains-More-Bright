import dns.resolver
from typing import Any, Dict, List


PROVIDERS = [
    "amazonaws.com",
    "azurewebsites.net",
    "cloudapp.net",
    "herokudns.com",
    "github.io",
    "readthedocs.io",
    "storage.googleapis.com",
    "fastly.net",
    "wpengine.com",
    "surge.sh",
    "netlify.app",
    "vercel.app",
]


def check_cname_takeover(domain: str) -> Dict[str, Any]:
    try:
        answers = dns.resolver.resolve(domain, "CNAME", lifetime=3)
    except Exception:
        return {"has_cname": False, "cname": None, "takeover_risk": False}

    cname = str(answers[0].target).rstrip(".")
    provider = next((p for p in PROVIDERS if cname.endswith(p)), None)

    # check if cname target resolves to A/AAAA
    try:
        dns.resolver.resolve(cname, "A", lifetime=3)
        resolves = True
    except Exception:
        resolves = False

    takeover_risk = provider is not None and not resolves

    return {
        "has_cname": True,
        "cname": cname,
        "provider": provider,
        "target_resolves": resolves,
        "takeover_risk": takeover_risk,
    }
