import requests
from typing import Dict, Any

def analyze_http(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}" # Assume HTTPS primarily
    try:
        resp = requests.get(url, timeout=5, allow_redirects=True)
        
        # Security Headers Check
        security_headers = {
            "Strict-Transport-Security": "Missing",
            "Content-Security-Policy": "Missing",
            "X-Frame-Options": "Missing",
            "X-Content-Type-Options": "Missing",
            "Referrer-Policy": "Missing",
            "Permissions-Policy": "Missing"
        }
        
        missing_count = 0
        recommendations = []
        
        if "Content-Security-Policy" not in resp.headers:
            missing_count += 2 # Heavy penalty
            recommendations.append("Missing Content-Security-Policy (CSP): Vulnerable to XSS and Data Injection.")
            
        if "Strict-Transport-Security" not in resp.headers:
            missing_count += 1
            recommendations.append("Missing HSTS: Users typically vulnerable to MITM downgrades.")
        
        if "X-Frame-Options" not in resp.headers:
             missing_count += 1
             recommendations.append("Missing X-Frame-Options: Vulnerable to Clickjacking.")
             
        if "X-Content-Type-Options" not in resp.headers:
             recommendations.append("Missing X-Content-Type-Options: Risk of MIME sniffing attacks.")

        for h in security_headers.keys():
            if h in resp.headers:
                security_headers[h] = "Present"
                
        # Simple Logic Grade
        grade = "A"
        if missing_count >= 2: grade = "B"
        if missing_count >= 4: grade = "C"
        if missing_count >= 5: grade = "F"

        return {
            "status_code": resp.status_code,
            "url": resp.url,
            "headers": dict(resp.headers),
            "server": resp.headers.get("Server"),
            "security_details": security_headers,
            "security_grade": grade,
            "recommendations": recommendations
        }
    except Exception as e:
        # Fallback to HTTP
        try:
             resp = requests.get(f"http://{domain}", timeout=5)
             return {
                "status_code": resp.status_code,
                "url": resp.url,
                "headers": dict(resp.headers),
                "server": resp.headers.get("Server"),
                "note": "Fallback to HTTP",
                "security_details": {}
            }
        except Exception as inner_e:
            return {"error": str(inner_e)}
