import dns.resolver
import dns.query
import dns.zone
from typing import Any, Dict, List, Optional


def _get_txt_records(name: str) -> List[str]:
    records = []
    try:
        answers = dns.resolver.resolve(name, "TXT", lifetime=3)
        for rdata in answers:
            for item in rdata.strings:
                try:
                    records.append(item.decode("utf-8"))
                except Exception:
                    records.append(str(item))
    except Exception:
        pass
    return records


def _has_spf(records: List[str]) -> Optional[str]:
    for rec in records:
        if rec.lower().startswith("v=spf1"):
            return rec
    return None


def _get_dmarc(domain: str) -> Optional[str]:
    records = _get_txt_records(f"_dmarc.{domain}")
    for rec in records:
        if rec.lower().startswith("v=dmarc"):
            return rec
    return None


def _check_zone_transfer(domain: str) -> Dict[str, Any]:
    try:
        ns_answers = dns.resolver.resolve(domain, "NS", lifetime=3)
    except Exception:
        return {"vulnerable": False, "servers": []}

    vulnerable = []
    for ns in ns_answers:
        ns_name = str(ns.target).rstrip(".")
        try:
            zone = dns.zone.from_xfr(dns.query.xfr(ns_name, domain, lifetime=3))
            if zone:
                vulnerable.append(ns_name)
        except Exception:
            continue

    return {"vulnerable": len(vulnerable) > 0, "servers": vulnerable}


def check_dns_security(domain: str) -> Dict[str, Any]:
    root_txt = _get_txt_records(domain)
    spf = _has_spf(root_txt)
    dmarc = _get_dmarc(domain)

    dkim_selectors = ["default", "google", "selector1", "selector2", "mail", "smtp", "k1", "k2"]
    dkim_found = []
    for selector in dkim_selectors:
        recs = _get_txt_records(f"{selector}._domainkey.{domain}")
        for rec in recs:
            if "v=dkim" in rec.lower():
                dkim_found.append(selector)
                break

    zone_transfer = _check_zone_transfer(domain)

    return {
        "spf": {"present": spf is not None, "record": spf},
        "dmarc": {"present": dmarc is not None, "record": dmarc},
        "dkim": {"selectors_found": dkim_found},
        "zone_transfer": zone_transfer,
    }
