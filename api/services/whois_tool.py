import whois
from typing import Dict, Any, Optional

def get_whois_details(domain: str) -> Optional[Dict[str, Any]]:
    try:
        w = whois.whois(domain)
        # Helper to safely serialize dates
        def serialize(val):
            if isinstance(val, list):
                return [str(v) for v in val]
            return str(val) if val else None

        return {
            "registrar": w.registrar,
            "creation_date": serialize(w.creation_date),
            "expiration_date": serialize(w.expiration_date),
            "updated_date": serialize(w.updated_date),
            "status": w.status if isinstance(w.status, list) else [w.status],
            "emails": w.emails if isinstance(w.emails, list) else [w.emails],
            "name_servers": w.name_servers,
            "org": w.org,
            "city": w.city,
            "country": w.country
        }
    except Exception as e:
        return {"error": str(e)}
