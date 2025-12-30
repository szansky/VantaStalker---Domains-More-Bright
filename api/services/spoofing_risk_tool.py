from typing import Any, Dict
from services.dns_security_tool import check_dns_security


def analyze_spoofing_risk(domain: str) -> Dict[str, Any]:
    dns_sec = check_dns_security(domain)
    spf = dns_sec.get("spf", {})
    dmarc = dns_sec.get("dmarc", {})

    spf_record = (spf.get("record") or "").lower()
    dmarc_record = (dmarc.get("record") or "").lower()

    spf_strict = "-all" in spf_record
    spf_soft = "~all" in spf_record

    dmarc_policy = None
    if "p=" in dmarc_record:
        try:
            dmarc_policy = dmarc_record.split("p=")[1].split(";")[0]
        except Exception:
            dmarc_policy = None

    risk = "high"
    if spf_strict and dmarc_policy in ("quarantine", "reject"):
        risk = "low"
    elif spf_soft or dmarc_policy == "none":
        risk = "medium"

    return {
        "spf_present": spf.get("present"),
        "dmarc_present": dmarc.get("present"),
        "spf_strict": spf_strict,
        "dmarc_policy": dmarc_policy,
        "risk": risk,
    }
