import re
import requests
from typing import Dict, Any

def analyze_ghost_track(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}"
    results = {
        "tracking_ids": [],
        "adsense_ids": [],
        "social_pixels": [],
        "verification_codes": []
    }

    try:
        resp = requests.get(url, timeout=5, headers={
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        text = resp.text

        # Google Analytics
        # UA-XXXXX-Y
        ua_matches = re.findall(r'UA-\d{4,10}-\d{1,2}', text)
        # G-XXXXXXXXXX
        g_matches = re.findall(r'G-[A-Z0-9]{10}', text)
        results["tracking_ids"].extend(list(set(ua_matches + g_matches)))

        # Google AdSense
        # pub-XXXXXXXXXXXXXXXX
        adsense_matches = re.findall(r'pub-\d{16}', text)
        results["adsense_ids"].extend(list(set(adsense_matches)))

        # Facebook Pixel
        # fbevents.js ... id=XXXXXXXXXXXXXXX
        fb_matches = re.findall(r'fbq\([\'"]init[\'"],\s*[\'"](\d{10,20})[\'"]\)', text)
        results["social_pixels"].extend(list(set(fb_matches)))

        # Verification Codes (meta names)
        # google-site-verification, facebook-domain-verification
        verification_patterns = [
            r'name=["\']google-site-verification["\']\s+content=["\']([^"\']+)["\']',
            r'name=["\']facebook-domain-verification["\']\s+content=["\']([^"\']+)["\']',
             r'name=["\']yandex-verification["\']\s+content=["\']([^"\']+)["\']'
        ]
        
        for pat in verification_patterns:
            matches = re.findall(pat, text)
            if matches:
                results["verification_codes"].extend(list(set(matches)))

        # Generate Reverse Search Links
        reverse_links = []
        all_ids = results["tracking_ids"] + results["adsense_ids"] + results["social_pixels"]
        
        for tid in list(set(all_ids)):
             reverse_links.append({
                 "id": tid,
                 "builtwith": f"https://builtwith.com/relationships/{tid}",
                 "dnslytics": f"https://dnslytics.com/search?q={tid}"
             })
             
        results["reverse_links"] = reverse_links

    except Exception as e:
        results["error"] = str(e)

    return results
