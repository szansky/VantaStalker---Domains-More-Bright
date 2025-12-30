import requests
from typing import Any, Dict, List


def analyze_header_quality(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}"
    try:
        resp = requests.get(url, timeout=5, allow_redirects=True)
        headers = resp.headers
    except Exception as exc:
        return {"error": str(exc)}

    issues = []
    recommendations = []
    score = 100

    csp = headers.get("Content-Security-Policy", "")
    if not csp:
        score -= 20
        issues.append("Missing Content-Security-Policy")
        recommendations.append("Add CSP header with strict policy.")
    else:
        if "unsafe-inline" in csp or "*" in csp:
            score -= 10
            issues.append("Weak CSP policy detected")
            recommendations.append("Remove unsafe-inline and wildcard sources.")

    hsts = headers.get("Strict-Transport-Security", "")
    if not hsts:
        score -= 10
        issues.append("Missing HSTS")
        recommendations.append("Add HSTS with long max-age and includeSubDomains.")
    else:
        if "max-age" in hsts:
            try:
                max_age = int(hsts.split("max-age=")[1].split(";")[0].strip())
                if max_age < 15552000:
                    score -= 5
                    issues.append("HSTS max-age is low")
                    recommendations.append("Increase HSTS max-age to at least 6 months.")
            except Exception:
                pass

    xfo = headers.get("X-Frame-Options", "")
    if not xfo:
        score -= 10
        issues.append("Missing X-Frame-Options")
        recommendations.append("Set X-Frame-Options to DENY or SAMEORIGIN.")

    xcto = headers.get("X-Content-Type-Options", "")
    if not xcto or xcto.lower() != "nosniff":
        score -= 5
        issues.append("Weak X-Content-Type-Options")
        recommendations.append("Set X-Content-Type-Options to nosniff.")

    refpol = headers.get("Referrer-Policy", "")
    if not refpol:
        score -= 5
        issues.append("Missing Referrer-Policy")
        recommendations.append("Set Referrer-Policy to strict-origin-when-cross-origin.")

    perm = headers.get("Permissions-Policy", "")
    if not perm:
        score -= 5
        issues.append("Missing Permissions-Policy")
        recommendations.append("Define Permissions-Policy to disable unused features.")

    score = max(0, min(100, score))
    grade = "A"
    if score < 90:
        grade = "B"
    if score < 70:
        grade = "C"
    if score < 50:
        grade = "D"
    if score < 30:
        grade = "F"

    return {
        "score": score,
        "grade": grade,
        "issues": issues,
        "recommendations": recommendations,
        "headers": dict(headers),
    }
