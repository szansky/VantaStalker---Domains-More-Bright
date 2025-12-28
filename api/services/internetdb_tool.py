import requests
from typing import Dict, Any

def internetdb_lookup(ip: str) -> Dict[str, Any]:
    """
    Queries Shodan's InternetDB API.
    This is a FREE endpoint provided by Shodan that gives open ports, CPEs, and tags
    for a given IP address, no API key required.
    """
    results = {
        "ip": ip,
        "ports": [],
        "cpes": [],
        "hostnames": [],
        "tags": [],
        "vulns": []
    }
    
    try:
        url = f"https://internetdb.shodan.io/{ip}"
        resp = requests.get(url, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            results["ports"] = data.get("ports", [])
            results["cpes"] = data.get("cpes", [])
            results["hostnames"] = data.get("hostnames", [])
            results["tags"] = data.get("tags", [])
            results["vulns"] = data.get("vulns", [])
        elif resp.status_code == 404:
            results["error"] = "No data found for this IP in InternetDB"
            
    except Exception as e:
        results["error"] = str(e)
        
    return results
