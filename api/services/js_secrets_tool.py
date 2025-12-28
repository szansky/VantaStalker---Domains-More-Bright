import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, Any, List

def scan_js_secrets(domain: str) -> Dict[str, Any]:
    """
    Fetches loaded JavaScript files and scans for exposed secrets/API keys.
    """
    base_url = f"https://{domain}"
    results = {
        "js_files_scanned": 0,
        "secrets_found": [],
        "api_endpoints": [],
        "internal_urls": []
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    # Patterns for secrets
    secret_patterns = [
        (r'AIza[0-9A-Za-z\-_]{35}', "Google API Key"),
        (r'AKIA[0-9A-Z]{16}', "AWS Access Key"),
        (r'sk_live_[0-9a-zA-Z]{24,}', "Stripe Secret Key"),
        (r'pk_live_[0-9a-zA-Z]{24,}', "Stripe Publishable Key"),
        (r'ghp_[0-9a-zA-Z]{36}', "GitHub Personal Token"),
        (r'gho_[0-9a-zA-Z]{36}', "GitHub OAuth Token"),
        (r'glpat-[0-9a-zA-Z\-]{20,}', "GitLab Token"),
        (r'xox[baprs]-[0-9a-zA-Z]{10,}', "Slack Token"),
        (r'sq0atp-[0-9A-Za-z\-_]{22}', "Square Access Token"),
        (r'eyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+', "JWT Token"),
        (r'-----BEGIN (RSA |EC )?PRIVATE KEY-----', "Private Key"),
        (r'["\']api[_-]?key["\']\s*[:=]\s*["\'][a-zA-Z0-9]{16,}["\']', "Generic API Key"),
        (r'firebase[a-zA-Z0-9\-:/_\.]+\.firebaseio\.com', "Firebase URL"),
        (r'mongodb(\+srv)?://[^\s<>"]+', "MongoDB Connection String"),
    ]
    
    # Internal URL patterns
    internal_patterns = [
        r'https?://[a-zA-Z0-9\-]+\.(staging|dev|test|internal|local|corp)\.[a-zA-Z]+',
        r'https?://(admin|api|dev|staging|internal)\.[^\s"\'<>]+',
        r'https?://[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+[^\s"\'<>]*',
    ]
    
    try:
        # First, get HTML and find JS files
        resp = requests.get(base_url, timeout=5, headers=headers)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        js_urls = set()
        for script in soup.find_all('script', src=True):
            src = script['src']
            if src.startswith('//'):
                src = 'https:' + src
            elif src.startswith('/'):
                src = base_url + src
            elif not src.startswith('http'):
                src = base_url + '/' + src
            js_urls.add(src)
        
        # Scan each JS file
        for js_url in list(js_urls)[:10]:  # Limit to 10 files
            try:
                js_resp = requests.get(js_url, timeout=5, headers=headers)
                if js_resp.status_code == 200:
                    results["js_files_scanned"] += 1
                    js_content = js_resp.text
                    
                    # Check for secrets
                    for pattern, name in secret_patterns:
                        matches = re.findall(pattern, js_content)
                        if matches:
                            for m in matches[:3]:  # Limit matches per pattern
                                results["secrets_found"].append({
                                    "type": name,
                                    "file": js_url.split('/')[-1],
                                    "preview": m[:40] + "..." if len(m) > 40 else m
                                })
                    
                    # Check for internal URLs
                    for pattern in internal_patterns:
                        matches = re.findall(pattern, js_content)
                        results["internal_urls"].extend(matches[:5])
                        
                    # Find API endpoints
                    api_matches = re.findall(r'["\']/(api|v[0-9])/[a-zA-Z0-9/_\-]+["\']', js_content)
                    results["api_endpoints"].extend([m for m in api_matches[:10]])
                    
            except:
                pass
        
        # Deduplicate
        results["internal_urls"] = list(set(results["internal_urls"]))[:20]
        results["api_endpoints"] = list(set(results["api_endpoints"]))[:20]
        
    except Exception as e:
        results["error"] = str(e)
    
    return results
