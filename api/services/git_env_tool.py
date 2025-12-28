import requests
from typing import Dict, Any, List

def scan_git_env(domain: str) -> Dict[str, Any]:
    """
    Checks for exposed sensitive configuration files that are commonly left public.
    - /.git/HEAD (Source code exposure)
    - /.env (Environment variables / Secrets)
    - /.DS_Store (Mac metadata)
    - /config.php.bak (Backup files)
    """
    base_url = f"https://{domain}"
    results = {
        "exposed": [],
        "scanned": [],
        "critical_found": False
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; VantaStalker/1.0)",
    }
    
    # Files to check
    checks = [
        {"path": "/.git/HEAD", "match": "ref: refs/", "name": "Git Repository (.git)", "severity": "CRITICAL"},
        {"path": "/.env", "match": "APP_KEY=", "name": "Environment File (.env)", "severity": "CRITICAL"},
        {"path": "/.env", "match": "DB_PASSWORD=", "name": "Environment File (.env)", "severity": "CRITICAL"},
        {"path": "/docker-compose.yml", "match": "version:", "name": "Docker Compose", "severity": "HIGH"},
        {"path": "/wp-config.php.bak", "match": "<?php", "name": "WP Config Backup", "severity": "HIGH"},
        {"path": "/.DS_Store", "match": None, "name": "Mac DS_Store", "severity": "LOW"},  # Binary check
    ]
    
    # Deduplicate paths safely
    paths = list(set([c["path"] for c in checks]))
    
    for path in paths:
        url = base_url + path
        results["scanned"].append(path)
        
        try:
            resp = requests.get(url, timeout=3, headers=headers, allow_redirects=False)
            
            if resp.status_code == 200:
                # Content verification to avoid false positives (custom 404s)
                content = resp.text
                
                # Verify match
                check_def = next((c for c in checks if c["path"] == path), None)
                if not check_def: continue
                
                confirmed = False
                if check_def["match"]:
                    if check_def["match"] in content:
                        confirmed = True
                else:
                    # Binary match or size check for DS_Store
                    if len(resp.content) > 100:
                        confirmed = True
                        
                if confirmed:
                    results["exposed"].append({
                        "file": path,
                        "name": check_def["name"],
                        "severity": check_def["severity"],
                        "url": url
                    })
                    if check_def["severity"] == "CRITICAL":
                        results["critical_found"] = True
                        
        except Exception:
            pass
            
    return results
