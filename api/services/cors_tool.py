import requests
from typing import Dict, Any

def check_cors(domain: str) -> Dict[str, Any]:
    """
    Checks for CORS misconfigurations (wildcard access).
    """
    url = f"https://{domain}"
    results = {
        "vulnerable": False,
        "acao_header": None,
        "severity": "SAFE"
    }
    
    # We send a request with a fake Origin to see if the server reflects it or allows *
    headers = {
        "Origin": "https://evil-attacker.com"
    }
    
    try:
        resp = requests.get(url, timeout=3, headers=headers)
        
        acao = resp.headers.get("Access-Control-Allow-Origin")
        acac = resp.headers.get("Access-Control-Allow-Credentials")
        
        if acao:
            results["acao_header"] = acao
            
            if acao == "*":
                results["vulnerable"] = True
                results["severity"] = "MEDIUM" # Public open
                
            if acao == "https://evil-attacker.com":
                 results["vulnerable"] = True
                 if acac == "true":
                     results["severity"] = "CRITICAL" # Reflected Origin + Credentials allowed
                 else:
                     results["severity"] = "HIGH" # Reflected Origin
                     
    except Exception:
        pass
        
    return results
