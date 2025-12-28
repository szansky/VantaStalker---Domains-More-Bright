from typing import List, Dict, Any
import urllib.parse

def check_cve(technologies: List[str]) -> Dict[str, Any]:
    """
    Generates CVE search links for detected technologies.
    """
    results = []
    
    unique_techs = list(set(technologies))
    
    for tech in unique_techs:
        # Tech string might be "WordPress (v5.8)"
        # We want to search for "WordPress 5.8 vulnerabilities"
        
        search_term = tech.replace(" (v", " ").replace(")", "")
        query = f"{search_term} vulnerabilities CVE"
        
        encoded_query = urllib.parse.quote(query)
        google_url = f"https://www.google.com/search?q={encoded_query}"
        
        # NIST NVD Search
        # Simple keyword search
        nvd_query = urllib.parse.quote(search_term.split(' ')[0]) # Just the product name usually best for NVD keyword
        nvd_url = f"https://nvd.nist.gov/vuln/search/results?form_type=Basic&results_type=overview&query={nvd_query}&search_type=all"
        
        results.append({
            "technology": tech,
            "google_link": google_url,
            "nvd_link": nvd_url
        })
        
    return {
        "cve_links": results,
        "count": len(results)
    }
