import json
import os
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
CASES_FILE = os.getenv("CASES_FILE", os.path.join(DATA_DIR, "cases.json"))


def _utc_now() -> str:
    return datetime.utcnow().isoformat() + "Z"


def _ensure_store() -> Dict[str, Any]:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.isfile(CASES_FILE):
        with open(CASES_FILE, "w", encoding="utf-8") as f:
            json.dump({"cases": []}, f, indent=2)
    with open(CASES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_store(store: Dict[str, Any]) -> None:
    with open(CASES_FILE, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2, sort_keys=True)


def list_cases() -> List[Dict[str, Any]]:
    store = _ensure_store()
    return store.get("cases", [])


def get_case(case_id: str) -> Optional[Dict[str, Any]]:
    store = _ensure_store()
    for case in store.get("cases", []):
        if case["id"] == case_id:
            return case
    return None


def create_case(name: str, description: str, status: str, tags: List[str]) -> Dict[str, Any]:
    store = _ensure_store()
    case = {
        "id": str(uuid.uuid4()),
        "name": name.strip() or "Untitled Case",
        "description": description.strip(),
        "status": status or "new",
        "tags": [t.strip() for t in tags if t.strip()],
        "created_at": _utc_now(),
        "updated_at": _utc_now(),
        "scans": []
    }
    store["cases"].append(case)
    _save_store(store)
    return case


def update_case(case_id: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    store = _ensure_store()
    for case in store.get("cases", []):
        if case["id"] == case_id:
            for key in ["name", "description", "status", "tags"]:
                if key in payload:
                    case[key] = payload[key]
            case["updated_at"] = _utc_now()
            _save_store(store)
            return case
    return None


def assign_scan(case_id: str, domain: str, timestamp: str) -> Optional[Dict[str, Any]]:
    store = _ensure_store()
    for case in store.get("cases", []):
        if case["id"] == case_id:
            case["scans"].append({
                "domain": domain,
                "timestamp": timestamp
            })
            case["updated_at"] = _utc_now()
            _save_store(store)
            return case
    return None
