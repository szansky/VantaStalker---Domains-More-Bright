import requests
import hashlib
from typing import Dict, Any

def get_favicon_hash(domain: str) -> Dict[str, Any]:
    """
    Fetches the favicon and calculates its hash.
    This hash can be used to find related sites via Shodan: http.favicon.hash:<hash>
    """
    results = {
        "found": False,
        "url": None,
        "md5": None,
        "mmh3": None,  # MurmurHash3 (Shodan uses this)
        "shodan_query": None
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; VantaStalker/1.0)"
    }
    
    # Common favicon locations
    favicon_urls = [
        f"https://{domain}/favicon.ico",
        f"https://{domain}/favicon.png",
        f"https://{domain}/apple-touch-icon.png"
    ]
    
    for fav_url in favicon_urls:
        try:
            resp = requests.get(fav_url, timeout=5, headers=headers)
            
            if resp.status_code == 200 and len(resp.content) > 100:
                results["found"] = True
                results["url"] = fav_url
                
                # MD5 Hash
                results["md5"] = hashlib.md5(resp.content).hexdigest()
                
                # MurmurHash3 (Shodan compatible)
                try:
                    import mmh3
                    import base64
                    favicon_b64 = base64.b64encode(resp.content).decode()
                    mmh3_hash = mmh3.hash(favicon_b64)
                    results["mmh3"] = mmh3_hash
                    results["shodan_query"] = f"http.favicon.hash:{mmh3_hash}"
                except ImportError:
                    results["mmh3"] = "mmh3 library not installed"
                    
                break
                
        except Exception as e:
            pass
    
    return results
