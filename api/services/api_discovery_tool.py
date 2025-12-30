import requests
from typing import Any, Dict, List


COMMON_ENDPOINTS = [
    "/api",
    "/api/v1",
    "/api/v2",
    "/admin",
    "/swagger",
    "/swagger/index.html",
    "/openapi.json",
    "/graphql",
    "/actuator",
    "/v2/api-docs",
]


def discover_api_endpoints(domain: str) -> Dict[str, Any]:
    base = f"https://{domain}"
    found = []
    for path in COMMON_ENDPOINTS:
        try:
            resp = requests.get(base + path, timeout=4, allow_redirects=False)
            if resp.status_code < 400:
                found.append({"path": path, "status": resp.status_code})
        except Exception:
            continue
    return {"found": found, "checked": len(COMMON_ENDPOINTS)}
