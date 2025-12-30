import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Any, Dict, Optional


_LOCK = threading.Lock()
_JOBS: Dict[str, Dict[str, Any]] = {}
_MAX_JOBS = 200
_EXECUTOR = ThreadPoolExecutor(max_workers=4)


def _utc_now() -> str:
    return datetime.utcnow().isoformat() + "Z"


def _trim_jobs() -> None:
    if len(_JOBS) <= _MAX_JOBS:
        return
    ordered = sorted(_JOBS.items(), key=lambda item: item[1].get("created_at", ""))
    for job_id, _ in ordered[: len(_JOBS) - _MAX_JOBS]:
        _JOBS.pop(job_id, None)


def create_job(payload: Dict[str, Any]) -> str:
    job_id = str(uuid.uuid4())
    with _LOCK:
        _JOBS[job_id] = {
            "id": job_id,
            "status": "queued",
            "created_at": _utc_now(),
            "updated_at": _utc_now(),
            "payload": payload,
            "progress": {},
            "tools": {},
            "error": None,
            "snapshot": None,
            "diff": None,
            "normalized": None,
            "saved": None,
        }
        _trim_jobs()
    return job_id


def update_job(job_id: str, updates: Dict[str, Any]) -> None:
    with _LOCK:
        job = _JOBS.get(job_id)
        if not job:
            return
        job.update(updates)
        job["updated_at"] = _utc_now()


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    with _LOCK:
        job = _JOBS.get(job_id)
        if not job:
            return None
        return dict(job)


def submit_job(fn, *args, **kwargs) -> str:
    payload = kwargs.pop("payload", {})
    job_id = create_job(payload)
    _EXECUTOR.submit(fn, job_id, *args, **kwargs)
    return job_id
