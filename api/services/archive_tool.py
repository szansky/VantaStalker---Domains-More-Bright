import requests
from typing import Dict, Any
from datetime import datetime

def get_archive_history(domain: str) -> Dict[str, Any]:
    """
    Queries the Wayback Machine CDX API to get historical context.
    """
    url = f"http://web.archive.org/cdx/search/cdx?url={domain}&output=json&fl=timestamp,statuscode&limit=1"
    
    # Get First Snapshot
    try:
        # First ever
        resp_first = requests.get(f"{url}&sort=timestamp", timeout=5)
        first_seen = None
        if resp_first.status_code == 200:
            data = resp_first.json()
            if len(data) > 1:
                ts = data[1][0]
                first_seen = datetime.strptime(ts, "%Y%m%d%H%M%S").isoformat()

        # Last Snapshot
        resp_last = requests.get(f"{url}&sort=timestamp&collapse=timestamp:4", timeout=5) # 4=Yearly roughly
        last_seen = None
        total_snapshots = 0
        
        # Get count distinct years (approx)
        count_url = f"http://web.archive.org/cdx/search/cdx?url={domain}&output=json&fl=timestamp&collapse=timestamp:4"
        resp_count = requests.get(count_url, timeout=5)
        if resp_count.status_code == 200:
            data = resp_count.json()
            if len(data) > 1:
                total_snapshots = len(data) - 1 # exclude header
                last_seen = str(data[-1][0])
                try:
                    last_seen = datetime.strptime(last_seen, "%Y%m%d%H%M%S").isoformat()
                except:
                    pass

        return {
            "first_seen": first_seen,
            "last_seen": last_seen,
            "total_snapshots": total_snapshots,
            "wayback_url": f"https://web.archive.org/web/*/{domain}"
        }
    except Exception as e:
        return {"error": str(e), "first_seen": None}
