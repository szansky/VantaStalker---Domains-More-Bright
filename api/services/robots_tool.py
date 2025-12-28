import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re
from typing import Dict, Any, List

def analyze_robots_sitemap(domain: str) -> Dict[str, Any]:
    """
    Fetches and parses robots.txt and sitemap.xml to discover hidden paths.
    """
    base_url = f"https://{domain}"
    results = {
        "robots": {
            "found": False,
            "disallowed": [],
            "allowed": [],
            "sitemaps": [],
            "crawl_delay": None
        },
        "sitemap": {
            "found": False,
            "urls": [],
            "count": 0
        },
        "interesting_paths": []
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; VantaStalker/1.0)"
    }
    
    # 1. Fetch robots.txt
    try:
        robots_url = f"{base_url}/robots.txt"
        resp = requests.get(robots_url, timeout=5, headers=headers)
        
        if resp.status_code == 200 and "user-agent" in resp.text.lower():
            results["robots"]["found"] = True
            lines = resp.text.split('\n')
            
            for line in lines:
                line = line.strip()
                lower = line.lower()
                
                if lower.startswith("disallow:"):
                    path = line.split(":", 1)[1].strip()
                    if path and path != "/":
                        results["robots"]["disallowed"].append(path)
                        
                        # Flag interesting paths
                        interesting = ["admin", "backup", "config", "api", "private", "secret", "dev", "test", "staging", "old", "wp-", "login", "dashboard"]
                        if any(i in path.lower() for i in interesting):
                            results["interesting_paths"].append(path)
                            
                elif lower.startswith("allow:"):
                    path = line.split(":", 1)[1].strip()
                    if path:
                        results["robots"]["allowed"].append(path)
                        
                elif lower.startswith("sitemap:"):
                    sitemap_url = line.split(":", 1)[1].strip()
                    if sitemap_url.startswith("http"):
                        # Handle "Sitemap: http://..." case where split cuts URL
                        sitemap_url = line.split(" ", 1)[1].strip() if " " in line else sitemap_url
                    results["robots"]["sitemaps"].append(sitemap_url)
                    
                elif lower.startswith("crawl-delay:"):
                    try:
                        results["robots"]["crawl_delay"] = int(line.split(":")[1].strip())
                    except:
                        pass
                        
    except Exception as e:
        results["robots"]["error"] = str(e)
    
    # 2. Fetch Sitemap (from robots or default location)
    sitemap_urls = results["robots"]["sitemaps"] or [f"{base_url}/sitemap.xml", f"{base_url}/sitemap_index.xml"]
    
    for sitemap_url in sitemap_urls[:2]:  # Try first 2
        try:
            resp = requests.get(sitemap_url, timeout=5, headers=headers)
            if resp.status_code == 200 and "<?xml" in resp.text[:100]:
                results["sitemap"]["found"] = True
                
                # Parse XML
                soup = BeautifulSoup(resp.text, 'xml')
                locs = soup.find_all('loc')
                
                urls = [loc.text for loc in locs[:50]]  # Limit
                results["sitemap"]["urls"] = urls
                results["sitemap"]["count"] = len(locs)
                break
                
        except Exception as e:
            pass
    
    return results
