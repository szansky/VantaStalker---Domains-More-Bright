import requests
from typing import Dict, Any

def check_handles(domain: str) -> Dict[str, Any]:
    # Extract keyword from domain (e.g. "google" from "google.com")
    keyword = domain.split('.')[0]
    if "www." in keyword:
        keyword = keyword.replace("www.", "")
        
    results = {
        "keyword": keyword,
        "found_profiles": []
    }
    
    platforms = {
        "GitHub": f"https://github.com/{keyword}",
        "Twitter": f"https://twitter.com/{keyword}",
        "Instagram": f"https://www.instagram.com/{keyword}/",
        "Facebook": f"https://www.facebook.com/{keyword}",
        "Reddit": f"https://www.reddit.com/user/{keyword}",
        "Medium": f"https://medium.com/@{keyword}",
        "Pinterest": f"https://www.pinterest.com/{keyword}/"
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    for name, url in platforms.items():
        try:
            # Short timeout to keep it fast
            resp = requests.get(url, headers=headers, timeout=3, allow_redirects=True)
            if resp.status_code == 200:
                # Naive check - some sites return 200 even for 404 pages (soft 404), 
                # but for major platforms 200 usually means profile exists.
                # Adding simple content checks to reduce false positives
                text_lower = resp.text.lower()
                is_false_positive = False
                
                if "page not found" in text_lower or "doesn't exist" in text_lower:
                     is_false_positive = True
                     
                if not is_false_positive:
                    results["found_profiles"].append({
                        "platform": name,
                        "url": url
                    })
        except:
            pass # Ignore timeouts/connection errors
            
    return results
