import requests
from typing import Dict, Any

def detect_waf(domain: str) -> Dict[str, Any]:
    """
    Detects Web Application Firewalls (WAF) by analyzing headers and cookies.
    """
    url = f"https://{domain}"
    results = {
        "has_waf": False,
        "waf_name": None,
        "evidence": None
    }
    
    try:
        # 1. Normal Request
        resp = requests.get(url, timeout=5)
        headers = resp.headers
        cookies = resp.cookies
        
        # WAF Signatures (Simplified WafW00f logic)
        signatures = {
            "Cloudflare": ["cf-ray", "__cfduid", "cf-cache-status", "server: cloudflare"],
            "AWS WAF": ["x-amz-cf-id", "server: awselb"],
            "Akamai": ["x-akamai-transformed", "server: akamaighost"],
            "Imperva Incapsula": ["x-iinfo", "incap_ses", "visid_incap"],
            "F5 BIG-IP": ["struct", "bigip", "server: big-ip"],
            "Sucuri": ["server: sucuri", "x-sucuri-id"],
            "Barracuda": ["barra_counter_session"],
            "Citrix NetScaler": ["ns_af", "citrix_ns_id", "server: netscaler"]
        }
        
        # Check Headers & Server
        for waf, signs in signatures.items():
            for sign in signs:
                key, val = sign.split(": ") if ": " in sign else (sign, None)
                
                # Check Header Key
                if key.lower() in [h.lower() for h in headers.keys()]:
                     # If value required
                     if val:
                         if val.lower() in headers.get(key, "").lower():
                             results["has_waf"] = True
                             results["waf_name"] = waf
                             results["evidence"] = f"Header: {key}: {val}"
                             return results
                     else:
                         results["has_waf"] = True
                         results["waf_name"] = waf
                         results["evidence"] = f"Header logic: {key}"
                         return results
                         
                # Check Cookies
                for cookie in cookies:
                    if key in cookie.name:
                        results["has_waf"] = True
                        results["waf_name"] = waf
                        results["evidence"] = f"Cookie: {cookie.name}"
                        return results
                        
    except Exception as e:
        results["error"] = str(e)
        
    return results
