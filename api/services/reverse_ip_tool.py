import requests
from typing import Dict, Any, List

def reverse_ip_lookup(ip: str) -> Dict[str, Any]:
    """
    Uses HackerTarget free API to find other domains on the same IP.
    """
    results = {
        "domains": [],
        "count": 0
    }
    
    try:
        # HackerTarget free API (no key needed, rate limited)
        url = f"https://api.hackertarget.com/reverseiplookup/?q={ip}"
        resp = requests.get(url, timeout=10)
        
        if resp.status_code == 200:
            text = resp.text.strip()
            
            # Check for error messages
            if "error" in text.lower() or "API count exceeded" in text:
                results["error"] = text
            else:
                domains = [d.strip() for d in text.split('\n') if d.strip()]
                results["domains"] = domains[:50]  # Limit to 50
                results["count"] = len(domains)
                
    except Exception as e:
        results["error"] = str(e)
        
    return results
