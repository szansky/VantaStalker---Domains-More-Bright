import requests
from typing import Dict, Any, List

def get_crtsh_subdomains(domain: str) -> Dict[str, Any]:
    """
    Uses crt.sh Certificate Transparency logs to find subdomains.
    Much more reliable than brute-force methods.
    """
    results = {
        "subdomains": [],
        "count": 0,
        "certificates": []
    }
    
    try:
        # Extract base domain (simplistic approach: take last 2 parts if > 2)
        # For better accuracy we would need tldextract but we want to avoid deps
        parts = domain.split('.')
        base_domain = domain
        if len(parts) > 2:
            # Check for short TLDs like co.uk - naive check
            if len(parts[-2]) <= 3 and len(parts[-1]) <= 2:
                 if len(parts) > 3:
                     base_domain = ".".join(parts[-3:])
            else:
                 base_domain = ".".join(parts[-2:])
                 
        url = f"https://crt.sh/?q=%.{base_domain}&output=json"
        resp = requests.get(url, timeout=15)
        
        if resp.status_code == 200:
            data = resp.json()
            
            unique_names = set()
            certs = []
            
            for entry in data:
                name = entry.get("name_value", "")
                # Can contain multiple names separated by newlines
                for n in name.split('\n'):
                    n = n.strip().lower()
                    if n and n != domain and not n.startswith('*'):
                        unique_names.add(n)
                
                # Track certificate info (limit to first 10)
                if len(certs) < 10:
                    certs.append({
                        "issuer": entry.get("issuer_name", "Unknown"),
                        "not_before": entry.get("not_before"),
                        "not_after": entry.get("not_after")
                    })
            
            results["subdomains"] = sorted(list(unique_names))[:100]  # Limit
            results["count"] = len(unique_names)
            results["certificates"] = certs
                
    except Exception as e:
        results["error"] = str(e)
        
    return results
