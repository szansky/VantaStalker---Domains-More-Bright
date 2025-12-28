import requests
from typing import Dict, Any, List

def get_subdomains(domain: str) -> Dict[str, Any]:
    """
    Uses crt.sh to find subdomains via Certificate Transparency logs.
    """
    subdomains = set()
    try:
        # crt.sh returns JSON if we ask nicely
        # Extract base domain
        parts = domain.split('.')
        base_domain = domain
        if len(parts) > 2:
            if len(parts[-2]) <= 3 and len(parts[-1]) <= 2: # co.uk
                 if len(parts) > 3:
                     base_domain = ".".join(parts[-3:])
            else:
                 base_domain = ".".join(parts[-2:])
                 
        url = f"https://crt.sh/?q=%.{base_domain}&output=json"
        
        # User-Agent is important for some CT logs
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        
        if resp.status_code == 200:
            data = resp.json()
            for entry in data:
                name = entry.get('name_value')
                if name:
                    # Clean up multiline names
                    parts = name.split('\n')
                    for p in parts:
                        p = p.strip()
                        if p.endswith(domain) and '*' not in p:
                             subdomains.add(p)
                             
        return {
            "source": "crt.sh",
            "count": len(subdomains),
            "subdomains": sorted(list(subdomains))
        }
    except Exception as e:
        # Fallback empty
        return {"error": str(e), "subdomains": []}
