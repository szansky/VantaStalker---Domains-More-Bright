import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List
from urllib.parse import urljoin, urlparse

def crawl_site(domain: str) -> Dict[str, Any]:
    """
    Crawls the homepage and extracts internal and external links to build a site map.
    Limited depth to avoid infinite loops, focusing on immediate structure.
    """
    base_url = f"https://{domain}"
    results = {
        "internal": [],
        "external": [],
        "total_links": 0
    }
    
    headers = {"User-Agent": "VantaStalker/Crawler 1.0"}
    
    try:
        resp = requests.get(base_url, timeout=5, headers=headers)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            links = soup.find_all('a', href=True)
            
            seen_internal = set()
            seen_external = set()
            
            for link in links:
                href = link['href']
                full_url = urljoin(base_url, href)
                parsed = urlparse(full_url)
                
                # Check domain
                if domain in parsed.netloc:
                    # Internal
                    # Normalize path
                    path = parsed.path
                    if path not in seen_internal and path != "":
                        seen_internal.add(path)
                        results["internal"].append({"path": path, "url": full_url})
                elif parsed.netloc:
                    # External
                    if parsed.netloc not in seen_external:
                        seen_external.add(parsed.netloc)
                        results["external"].append(parsed.netloc)
                        
            # Limit results for UI
            results["internal"] = sorted(list(results["internal"]), key=lambda x: x['path'])[:50]
            results["external"] = sorted(list(results["external"]))[:20]
            results["total_links"] = len(links)
            
    except Exception as e:
        results["error"] = str(e)
        
    return results
