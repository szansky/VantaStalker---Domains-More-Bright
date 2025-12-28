import requests
import re
from typing import Dict, Any, List

def analyze_comments(domain: str) -> Dict[str, Any]:
    """
    Scrapes HTML and inline JS for comments that might reveal developer info.
    """
    url = f"https://{domain}"
    results = {
        "comments": [],
        "potential_users": [],
        "emails": []
    }
    
    try:
        resp = requests.get(url, timeout=5, headers={
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        text = resp.text
        
        # Regex for HTML comments <!-- -->
        html_comments = re.findall(r'<!--(.*?)-->', text, re.DOTALL)
        
        # Regex for JS comments // and /* */
        # This is a naive regex and might match content inside strings, but acceptable for intel gathering
        js_single = re.findall(r'//(.*?)\n', text)
        js_multi = re.findall(r'/\*(.*?)\*/', text, re.DOTALL)
        
        all_comments = html_comments + js_single + js_multi
        
        # Filter and clean
        unique_comments = set()
        for c in all_comments:
            clean = c.strip()
            if len(clean) > 3 and len(clean) < 200: # Filter noise
                # Filter out common framework comments? maybe later
                unique_comments.add(clean)
                
        # Intel extraction from comments
        for c in unique_comments:
            # Look for handles @user
            handles = re.findall(r'@([a-zA-Z0-9_]+)', c)
            for h in handles:
                if len(h) > 3: results["potential_users"].append(h)
                
            # Look for TODOs or Names
            if "TODO" in c or "FIXME" in c:
                results["comments"].append(c)
            elif "author" in c.lower() or "created by" in c.lower():
                results["comments"].append(c)
            else:
                # Add generic comments if they look interesting (heuristic)
                # For now, let's just add them if they aren't obviously minimized code
                if "Copyright" not in c and "license" not in c.lower():
                     if len(results["comments"]) < 20: # Limit noise
                        results["comments"].append(c)

        results["potential_users"] = list(set(results["potential_users"]))
        
    except Exception as e:
        results["error"] = str(e)

    return results
