import requests
from typing import Dict, Any

def get_security_txt(domain: str) -> Dict[str, Any]:
    """
    Fetches /.well-known/security.txt or /security.txt
    This file contains security contact info per RFC 9116.
    """
    results = {
        "found": False,
        "contact": [],
        "encryption": None,
        "acknowledgments": None,
        "policy": None,
        "hiring": None,
        "expires": None,
        "raw": None
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; VantaStalker/1.0)"
    }
    
    # Try both standard locations
    urls = [
        f"https://{domain}/.well-known/security.txt",
        f"https://{domain}/security.txt"
    ]
    
    for url in urls:
        try:
            resp = requests.get(url, timeout=5, headers=headers)
            
            if resp.status_code == 200 and ("contact:" in resp.text.lower() or "expires:" in resp.text.lower()):
                results["found"] = True
                results["raw"] = resp.text[:2000]  # Limit raw output
                
                for line in resp.text.split('\n'):
                    line = line.strip()
                    lower = line.lower()
                    
                    if lower.startswith("contact:"):
                        results["contact"].append(line.split(":", 1)[1].strip())
                    elif lower.startswith("encryption:"):
                        results["encryption"] = line.split(":", 1)[1].strip()
                    elif lower.startswith("acknowledgments:") or lower.startswith("acknowledgements:"):
                        results["acknowledgments"] = line.split(":", 1)[1].strip()
                    elif lower.startswith("policy:"):
                        results["policy"] = line.split(":", 1)[1].strip()
                    elif lower.startswith("hiring:"):
                        results["hiring"] = line.split(":", 1)[1].strip()
                    elif lower.startswith("expires:"):
                        results["expires"] = line.split(":", 1)[1].strip()
                
                break  # Found, no need to check other URL
                
        except Exception as e:
            pass
    
    return results
