import requests
import re
from typing import Dict, Any, List
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def harvest_emails(domain: str) -> Dict[str, Any]:
    """
    Crawls the homepage and common subpages (Contact, About) to find email addresses.
    Replaces need for external search engine scraping (Google/Bing) which blocks easily.
    """
    base_url = f"https://{domain}"
    results = {
        "emails": [],
        "sources": [],
        "pages_scanned": 0
    }
    
    # Policies to respect
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; VantaStalker/1.0; +https://github.com/szansky/vantastalker)"
    }
    
    # Pages to check
    paths_to_check = [
        "/",
        "/contact",
        "/about",
        "/contact-us",
        "/about-us",
        "/team",
        "/impressum"  # Common in EU
    ]
    
    unique_emails = set()
    scanned_urls = []
    
    for path in paths_to_check:
        try:
            target_url = urljoin(base_url, path)
            resp = requests.get(target_url, timeout=5, headers=headers)
            
            if resp.status_code == 200:
                results["pages_scanned"] += 1
                scanned_urls.append(target_url)
                
                # Regex for emails
                # Standard pattern
                text_content = resp.text
                found = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text_content)
                
                # Filter out standard junk/images
                for email in found:
                    lower_email = email.lower()
                    if (lower_email.endswith(f"@{domain}") or True) and \
                       not lower_email.endswith(".png") and \
                       not lower_email.endswith(".jpg") and \
                       not lower_email.endswith(".js") and \
                       not lower_email.endswith(".css"):
                         unique_emails.add(lower_email)
                         
        except Exception:
            pass # Fail silently for individual pages
            
    results["emails"] = sorted(list(unique_emails))
    results["sources"] = scanned_urls
    
    return results
