from ipwhois import IPWhois
from typing import Dict, Any
import requests

def get_geo_details(ip: str) -> Dict[str, Any]:
    """
    Uses ipwhois for ASN/RDAP data and ip-api for friendly Location data.
    """
    result = {
        "asn": None,
        "org": None,
        "isp": None,
        "country": None,
        "city": None,
        "region": None,
        "lat": None,
        "lon": None
    }

    # 1. ASN / RDAP (More technical)
    try:
        obj = IPWhois(ip)
        rdap = obj.lookup_rdap(depth=1)
        result["asn"] = rdap.get("asn")
        result["org"] = rdap.get("asn_description")
    except Exception as e:
        print(f"IPWhois error: {e}")

    # 2. IP-API (Legacy, better for lat/lon/city)
    try:
        resp = requests.get(f"http://ip-api.com/json/{ip}", timeout=3)
        if resp.status_code == 200:
            data = resp.json()
            result["isp"] = data.get("isp")
            result["country"] = data.get("country")
            result["city"] = data.get("city")
            result["region"] = data.get("regionName")
            result["lat"] = data.get("lat")
            result["lon"] = data.get("lon")
            # Fallback if RDAP failed
            if not result["org"]:
                result["org"] = data.get("org")
            if not result["asn"] and data.get("as"):
                 result["asn"] = data.get("as").split(" ")[0] # "AS12345 Name" -> "AS12345"
    except Exception as e:
         print(f"IP-API error: {e}")

    return result
