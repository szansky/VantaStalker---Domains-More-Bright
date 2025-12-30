import requests
from typing import Any, Dict, List


PARAMS = ["next", "url", "redirect", "return", "continue"]
EXTERNAL = "https://example.com"


def check_open_redirect(domain: str) -> Dict[str, Any]:
    base = f"https://{domain}/"
    findings = []
    for param in PARAMS:
        try:
            resp = requests.get(base, params={param: EXTERNAL}, timeout=4, allow_redirects=False)
            loc = resp.headers.get("Location", "")
            if loc.startswith(EXTERNAL):
                findings.append({"param": param, "location": loc})
        except Exception:
            continue
    return {"findings": findings}


def check_host_header_injection(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}/"
    try:
        resp = requests.get(url, headers={"Host": "evil.example.com"}, timeout=4, allow_redirects=False)
        loc = resp.headers.get("Location", "")
        if "evil.example.com" in loc:
            return {"vulnerable": True, "location": loc}
    except Exception:
        pass
    return {"vulnerable": False}
