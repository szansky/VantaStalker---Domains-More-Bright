from typing import Dict, Any

def calculate_risk_score(data: Dict[str, Any]) -> Dict[str, Any]:
    score = 100 # Start with perfect score
    red_flags = []
    positive_signals = []

    # 1. Age Analysis (From Whois or Archive)
    creation_date = None
    if data.get("whois") and data["whois"].get("creation_date"):
        try:
            # Handle list or string
            cd = data["whois"]["creation_date"]
            if isinstance(cd, list): cd = cd[0]
            # Simple check if "2024" or "2025" is in the string for "freshness"
            # In real app, parse datetime properly.
            if "2024" in str(cd) or "2025" in str(cd):
                score -= 20
                red_flags.append("Domain is very new (< 1 year)")
            else:
                positive_signals.append("Domain maturity (> 1 year)")
        except:
            pass
            
    # 2. SSL Analysis
    if data.get("ssl"):
        if not data["ssl"].get("valid"):
            score -= 30
            red_flags.append("Invalid or Missing SSL Certificate")
        else:
            if data["ssl"].get("issuer", {}).get("organizationName") == "Let's Encrypt":
                 # Slight penalty for free certs in "Premium" context? Maybe not, but worth noting.
                 # score -= 5 
                 pass
            
    # 3. Security Headers
    if data.get("http") and data["http"].get("security_details"):
        headers = data["http"]["security_details"]
        missing_count = sum(1 for v in headers.values() if v == "Missing")
        if missing_count > 3:
            score -= 10
            red_flags.append("Weak Security Headers")
            
    # 4. Tech / Content (SCAM Detection)
    if data.get("html") and data["html"].get("scam_analysis"):
        scam_score = data["html"]["scam_analysis"].get("scam_score", 0)
        if scam_score > 0:
            score -= (scam_score * 10)
            red_flags.append(f"Potential Scam Keywords Detected ({scam_score} matches)")
            
    # 5. Open Ports
    if data.get("ports") and data["ports"].get("open_ports"):
        unsafe_ports = [21, 23, 3389] # FTP, Telnet, RDP
        for p in data["ports"]["open_ports"]:
            if p in unsafe_ports:
                score -= 15
                red_flags.append(f"Unsafe Port Open: {p}")

    # Clamp Score
    score = max(0, min(100, score))
    
    # Grade
    grade = "A"
    if score < 90: grade = "B"
    if score < 70: grade = "C"
    if score < 50: grade = "D"
    if score < 30: grade = "F"

    return {
        "score": score,
        "grade": grade,
        "red_flags": red_flags,
        "positive_signals": positive_signals,
        "summary": f"Target has a Trust Score of {score}/100 ({grade}). identified {len(red_flags)} red flags."
    }
