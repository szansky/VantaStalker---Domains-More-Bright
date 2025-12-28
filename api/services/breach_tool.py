from typing import List, Dict, Any
import urllib.parse

def check_breach(emails: List[str]) -> Dict[str, Any]:
    """
    Generates links to check if emails have been part of a data breach.
    """
    results = []
    
    unique_emails = list(set(emails))
    
    for email in unique_emails:
        # HaveIBeenPwned (HIBP)
        # HIBP doesn't allow direct search via URL for email without API, but we can link to the home page or specific searchs if supported.
        # Actually, standard user flow is just checking the site. 
        # But DeHashed or others might allow pre-filled.
        # Let's link to HIBP with standard instructions, or use Google dork for pastebin leaks of that email.
        
        hibp_url = f"https://haveibeenpwned.com/account/{email}" # Direct account check link if logged in, or just home.
        # Better: Search for leaks
        
        # DeHashed (Visual search)
        dehashed_query = urllib.parse.quote(email)
        dehashed_url = f"https://www.dehashed.com/search?query={dehashed_query}"
        
        # Intelx.io
        intelx_url = f"https://intelx.io/?s={email}"

        results.append({
            "email": email,
            "hibp_url": "https://haveibeenpwned.com/", # HIBP requires manual input on home usually unless using API
            "dehashed_url": dehashed_url,
            "intelx_url": intelx_url
        })
        
    return {
        "breach_links": results,
        "count": len(results)
    }
