from typing import Any, Dict, List
from services.score_tool import calculate_risk_score


RISKY_PORTS = {
    21: "FTP",
    23: "Telnet",
    25: "SMTP",
    110: "POP3",
    143: "IMAP",
    3389: "RDP",
    445: "SMB",
    5900: "VNC",
    6379: "Redis",
    27017: "MongoDB",
    3306: "MySQL",
    5432: "Postgres",
}


def _get_headers_missing_count(http_data: Dict[str, Any]) -> int:
    headers = http_data.get("security_details") or {}
    return sum(1 for v in headers.values() if v == "Missing")


def _strip_versions(tech_list: List[str]) -> List[str]:
    stripped = []
    for t in tech_list:
        if " (v" in t:
            stripped.append(t.split(" (v")[0])
        else:
            stripped.append(t)
    return stripped


def _detect_correlations(normalized: Dict[str, Any]) -> List[Dict[str, str]]:
    correlations = []
    waf = normalized.get("waf", {})
    ports = normalized.get("ports", {})
    tech = normalized.get("tech", [])
    headers_missing = normalized.get("security", {}).get("missing_headers", 0)
    ssl_valid = normalized.get("ssl", {}).get("valid")
    risky_ports = ports.get("risky_ports", [])

    if waf.get("has_waf") and risky_ports:
        correlations.append({
            "type": "warning",
            "title": "WAF does not cover non-HTTP services",
            "detail": f"Risky ports exposed: {', '.join(risky_ports)}"
        })

    if "WordPress" in tech and headers_missing >= 3:
        correlations.append({
            "type": "warning",
            "title": "WordPress with weak security headers",
            "detail": "Consider hardening headers and WordPress configuration."
        })

    if waf.get("has_waf") and ("Cloudflare" in tech or waf.get("waf_name") == "Cloudflare"):
        correlations.append({
            "type": "info",
            "title": "Cloudflare edge detected",
            "detail": "Consider direct-to-origin exposure checks."
        })

    if ssl_valid is False and headers_missing >= 3:
        correlations.append({
            "type": "warning",
            "title": "Weak TLS and headers",
            "detail": "TLS invalid plus multiple missing security headers."
        })

    secrets = normalized.get("content", {}).get("potential_secrets", [])
    if secrets:
        correlations.append({
            "type": "warning",
            "title": "Potential client-side secrets",
            "detail": f"Findings: {', '.join(secrets)}"
        })

    return correlations


def normalize_snapshot(snapshot: Dict[str, Any]) -> Dict[str, Any]:
    tools = snapshot.get("tools", {})

    dns = tools.get("dns") or {}
    http = tools.get("http") or {}
    tech = tools.get("tech") or {}
    ssl = tools.get("ssl") or {}
    ports = tools.get("ports") or {}
    waf = tools.get("waf") or {}
    geo = tools.get("geo") or {}

    tech_list = tech.get("technologies") or []
    normalized_tech = _strip_versions(tech_list)

    open_ports = ports.get("open_ports") or []
    risky_ports = [f"{p}/{RISKY_PORTS.get(p, 'unknown')}" for p in open_ports if p in RISKY_PORTS]

    score_input = {
        "whois": tools.get("whois") or {},
        "ssl": ssl,
        "http": http,
        "html": tech,
        "ports": ports,
    }
    score = calculate_risk_score(score_input)

    normalized = {
        "target": snapshot.get("target"),
        "collected_at": snapshot.get("collected_at"),
        "ip": dns.get("resolved_ip"),
        "location": {
            "country": geo.get("country"),
            "city": geo.get("city"),
            "org": geo.get("org"),
        },
        "tech": normalized_tech,
        "server": http.get("server") or tech.get("server"),
        "security": {
            "missing_headers": _get_headers_missing_count(http),
            "headers": http.get("security_details") or {},
        },
        "ssl": {
            "valid": ssl.get("valid"),
            "issuer": ssl.get("issuer"),
            "days_to_expiry": ssl.get("days_to_expiry"),
        },
        "waf": {
            "has_waf": waf.get("has_waf"),
            "waf_name": waf.get("waf_name"),
        },
        "ports": {
            "open_ports": open_ports,
            "risky_ports": risky_ports,
        },
        "content": {
            "potential_secrets": tech.get("potential_secrets") or [],
            "scam_score": tech.get("scam_analysis", {}).get("score", 0),
        },
        "score": score,
    }

    normalized["correlations"] = _detect_correlations(normalized)
    return normalized
