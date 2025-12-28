import socket
from typing import Dict, Any, List

# List of DNSBL servers to check
DNSBL_SERVERS = [
    "zen.spamhaus.org",
    "bl.spamcop.net",
    "b.barracudacentral.org",
    "dnsbl-1.uceprotect.net",
    "spam.dnsbl.sorbs.net",
    "cbl.abuseat.org",
    "dnsbl.dronebl.org",
    "rbl.interserver.net"
]

def check_dnsbl(ip: str) -> Dict[str, Any]:
    """
    Checks if an IP address is listed on common DNS Blacklists (spam/abuse).
    """
    results = {
        "listed": False,
        "blacklists": [],
        "clean_lists": 0,
        "total_checked": len(DNSBL_SERVERS)
    }
    
    # Reverse the IP for DNSBL query
    try:
        reversed_ip = ".".join(reversed(ip.split(".")))
    except:
        results["error"] = "Invalid IP format"
        return results
    
    for dnsbl in DNSBL_SERVERS:
        query = f"{reversed_ip}.{dnsbl}"
        try:
            socket.gethostbyname(query)
            # If we get a result, IP is listed
            results["listed"] = True
            results["blacklists"].append(dnsbl)
        except socket.gaierror:
            # No result = not listed (good)
            results["clean_lists"] += 1
        except Exception as e:
            pass
    
    return results
