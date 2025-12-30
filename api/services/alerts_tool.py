from typing import Any, Dict, List


def build_alerts(previous: Dict[str, Any], current: Dict[str, Any]) -> List[Dict[str, str]]:
    alerts = []
    prev_norm = previous.get("normalized") or {}
    curr_norm = current.get("normalized") or {}

    if not prev_norm or not curr_norm:
        return alerts

    if prev_norm.get("waf", {}).get("waf_name") != curr_norm.get("waf", {}).get("waf_name"):
        alerts.append({
            "type": "change",
            "title": "WAF changed",
            "detail": f"{prev_norm.get('waf', {}).get('waf_name')} → {curr_norm.get('waf', {}).get('waf_name')}"
        })

    if prev_norm.get("ssl", {}).get("valid") != curr_norm.get("ssl", {}).get("valid"):
        alerts.append({
            "type": "change",
            "title": "SSL validity changed",
            "detail": f"{prev_norm.get('ssl', {}).get('valid')} → {curr_norm.get('ssl', {}).get('valid')}"
        })

    if prev_norm.get("tech") != curr_norm.get("tech"):
        alerts.append({
            "type": "change",
            "title": "Tech stack changed",
            "detail": "Detected technology list changed."
        })

    prev_ports = set(prev_norm.get("ports", {}).get("open_ports") or [])
    curr_ports = set(curr_norm.get("ports", {}).get("open_ports") or [])
    if prev_ports != curr_ports:
        added = sorted(curr_ports - prev_ports)
        removed = sorted(prev_ports - curr_ports)
        detail_parts = []
        if added:
            detail_parts.append(f"added {', '.join(map(str, added))}")
        if removed:
            detail_parts.append(f"removed {', '.join(map(str, removed))}")
        alerts.append({
            "type": "change",
            "title": "Open ports changed",
            "detail": "; ".join(detail_parts) if detail_parts else "Port list changed."
        })

    prev_score = (prev_norm.get("score") or {}).get("score")
    curr_score = (curr_norm.get("score") or {}).get("score")
    if prev_score is not None and curr_score is not None and prev_score != curr_score:
        alerts.append({
            "type": "change",
            "title": "Risk score changed",
            "detail": f"{prev_score} → {curr_score}"
        })

    prev_hash = ((previous.get("tools") or {}).get("screenshot") or {}).get("hash")
    curr_hash = ((current.get("tools") or {}).get("screenshot") or {}).get("hash")
    if prev_hash and curr_hash and prev_hash != curr_hash:
        alerts.append({
            "type": "change",
            "title": "Screenshot changed",
            "detail": "Visual snapshot hash changed between scans."
        })

    return alerts
