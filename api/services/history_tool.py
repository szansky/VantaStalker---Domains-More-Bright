import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
HISTORY_DIR = os.getenv("HISTORY_DIR", os.path.join(BASE_DIR, "data", "history"))
MAX_DIFF_ENTRIES = 200


def _safe_domain(domain: str) -> str:
    return (
        domain.replace("/", "_")
        .replace("\\", "_")
        .replace(":", "_")
        .strip()
    )


def _domain_dir(domain: str) -> str:
    return os.path.join(HISTORY_DIR, _safe_domain(domain))


def _timestamp() -> str:
    return datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")


def save_snapshot(domain: str, snapshot: Dict[str, Any]) -> Dict[str, Any]:
    os.makedirs(_domain_dir(domain), exist_ok=True)
    ts = _timestamp()
    filename = f"{ts}.json"
    path = os.path.join(_domain_dir(domain), filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2, sort_keys=True)
    return {"timestamp": ts, "filename": filename}


def list_snapshots(domain: str) -> List[Dict[str, str]]:
    directory = _domain_dir(domain)
    if not os.path.isdir(directory):
        return []
    items = []
    for name in os.listdir(directory):
        if not name.endswith(".json"):
            continue
        ts = name.replace(".json", "")
        items.append({"timestamp": ts, "filename": name})
    return sorted(items, key=lambda x: x["timestamp"])


def parse_timestamp(ts: str) -> Optional[datetime]:
    try:
        return datetime.strptime(ts, "%Y%m%dT%H%M%SZ")
    except ValueError:
        return None


def load_snapshot(domain: str, timestamp: str) -> Optional[Dict[str, Any]]:
    filename = f"{timestamp}.json" if not timestamp.endswith(".json") else timestamp
    path = os.path.join(_domain_dir(domain), filename)
    if not os.path.isfile(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_latest_snapshot(domain: str) -> Optional[Dict[str, Any]]:
    history = list_snapshots(domain)
    if not history:
        return None
    latest = history[-1]
    return load_snapshot(domain, latest["timestamp"])


def _is_scalar(value: Any) -> bool:
    return value is None or isinstance(value, (str, int, float, bool))


def _diff_dict(old: Any, new: Any, path: str = "") -> List[Dict[str, Any]]:
    diffs: List[Dict[str, Any]] = []

    if type(old) != type(new):
        diffs.append({"type": "changed", "path": path or "$"})
        return diffs

    if isinstance(old, dict):
        old_keys = set(old.keys())
        new_keys = set(new.keys())
        for key in sorted(old_keys - new_keys):
            diffs.append({"type": "removed", "path": f"{path}.{key}" if path else key})
        for key in sorted(new_keys - old_keys):
            diffs.append({"type": "added", "path": f"{path}.{key}" if path else key})
        for key in sorted(old_keys & new_keys):
            diffs.extend(_diff_dict(old[key], new[key], f"{path}.{key}" if path else key))
        return diffs

    if isinstance(old, list):
        if old != new:
            diffs.append({"type": "changed", "path": path or "$"})
        return diffs

    if old != new:
        entry = {"type": "changed", "path": path or "$"}
        if _is_scalar(old) and _is_scalar(new):
            entry["from"] = old
            entry["to"] = new
        diffs.append(entry)
    return diffs


def compare_snapshots(previous: Dict[str, Any], snapshot: Dict[str, Any]) -> Dict[str, Any]:
    diffs = _diff_dict(previous, snapshot)
    if len(diffs) > MAX_DIFF_ENTRIES:
        diffs = diffs[:MAX_DIFF_ENTRIES]
        truncated = True
    else:
        truncated = False

    counts = {"added": 0, "removed": 0, "changed": 0}
    for diff in diffs:
        counts[diff["type"]] += 1

    return {
        "counts": counts,
        "items": diffs[:50],
        "truncated": truncated,
    }


def compare_with_latest(domain: str, snapshot: Dict[str, Any]) -> Dict[str, Any]:
    history = list_snapshots(domain)
    if not history:
        return {"has_previous": False}

    latest = history[-1]
    previous = load_snapshot(domain, latest["timestamp"])
    if previous is None:
        return {"has_previous": False}

    comparison = compare_snapshots(previous, snapshot)
    return {
        "has_previous": True,
        "previous_timestamp": latest["timestamp"],
        "counts": comparison["counts"],
        "items": comparison["items"],
        "truncated": comparison["truncated"],
    }
