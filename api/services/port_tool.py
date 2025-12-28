import socket
from typing import Dict, Any, List
import concurrent.futures

def scan_ports(target: str) -> Dict[str, Any]:
    # Top 20 common ports to scan quickly
    COMMON_PORTS = [
        21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 
        3306, 3389, 5432, 8000, 8080, 8443, 9090, 27017, 6379
    ]
    
    open_ports = []
    
    def check_port(port):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1.0) # Fast timeout
                if s.connect_ex((target, port)) == 0:
                    return port
        except:
            pass
        return None

    try:
        # Use threading for speed
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            future_to_port = {executor.submit(check_port, port): port for port in COMMON_PORTS}
            for future in concurrent.futures.as_completed(future_to_port):
                p = future.result()
                if p:
                    open_ports.append(p)
                    
        return {"open_ports": sorted(open_ports), "scanned_ports": len(COMMON_PORTS)}
    
    except Exception as e:
        return {"error": str(e)}
