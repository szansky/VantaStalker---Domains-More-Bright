import requests
from typing import Any, Dict, List


RISKY_PATHS = [
    "/admin",
    "/login",
    "/backup",
    "/db",
    "/config",
    "/private",
    "/secret",
    "/.git",
]


def analyze_robots_security(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}/robots.txt"
    findings = []
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code >= 400:
            return {"present": False, "findings": [], "status_code": resp.status_code}
        lines = resp.text.splitlines()
        disallow = [line.split(":", 1)[1].strip() for line in lines if line.lower().startswith("disallow:")]
        for path in disallow:
            for risky in RISKY_PATHS:
                if path.startswith(risky):
                    findings.append(f"Robots disallows sensitive path: {path}")
        return {"present": True, "findings": findings, "disallow_count": len(disallow)}
    except Exception as exc:
        return {"error": str(exc)}


def analyze_security_txt(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}/.well-known/security.txt"
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code >= 400:
            return {"present": False, "status_code": resp.status_code}
        text = resp.text.lower()
        has_contact = "contact:" in text
        has_expires = "expires:" in text
        findings = []
        if not has_contact:
            findings.append("Missing Contact in security.txt")
        if not has_expires:
            findings.append("Missing Expires in security.txt")
        return {"present": True, "has_contact": has_contact, "has_expires": has_expires, "findings": findings}
    except Exception as exc:
        return {"error": str(exc)}
