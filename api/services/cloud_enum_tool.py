import requests
from typing import Dict, Any, List

def check_cloud_buckets(domain: str) -> Dict[str, Any]:
    """
    Checks for open public cloud storage buckets (AWS S3) based on domain name permutations.
    """
    # Generate variations
    # stabletcoin.com -> stabletcoin, stabletcoin-com, stabletcoin-backup, etc.
    base_name = domain.split('.')[0]
    variations = [
        base_name,
        f"{base_name}-start",
        f"{base_name}-assets",
        f"{base_name}-static",
        f"{base_name}-media",
        f"{base_name}-backup",
        f"{base_name}-dev",
        f"{base_name}-staging",
        f"www.{base_name}",
        domain.replace('.', '-')
    ]
    
    results = {
        "open_buckets": [],
        "checked_count": len(variations)
    }
    
    for name in variations:
        # AWS S3 URL Format
        bucket_url = f"https://{name}.s3.amazonaws.com"
        
        try:
            # Short timeout, we just check existence
            resp = requests.get(bucket_url, timeout=2)
            
            if resp.status_code == 200:
                # Open listing!
                results["open_buckets"].append({
                    "provider": "AWS S3",
                    "url": bucket_url,
                    "status": "OPEN (200)"
                })
            elif resp.status_code == 403:
                # Exists but protected
                # We typically only care about OPEN ones, but identifying existence is also intel
                results["open_buckets"].append({
                    "provider": "AWS S3",
                    "url": bucket_url,
                    "status": "Protected (403)"
                })
        except:
            pass
            
    return results
