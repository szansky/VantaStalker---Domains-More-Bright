import dns.resolver
from typing import Dict, Any, List

def check_subdomain_takeover(domain: str) -> Dict[str, Any]:
    """
    Checks the main domain and typical subdomains for 'dangling' CNAME records.
    (Simplified version - typically needs a huge list of subdomains)
    """
    results = {
        "vulnerable": [],
        "checked": [],
        "safe": True
    }
    
    # Signatures of vulnerable services
    signatures = [
        {"service": "GitHub Pages", "cname": "github.io", "error": "There isn't a GitHub Pages site here"},
        {"service": "Heroku", "cname": "herokuapp.com", "error": "Heroku | No such app"},
        {"service": "AWS S3", "cname": "amazonaws.com", "error": "The specified bucket does not exist"},
        {"service": "Shopify", "cname": "myshopify.com", "error": "Sorry, this shop is currently unavailable"},
        {"service": "Tumblr", "cname": "tumblr.com", "error": "Whatever you were looking for doesn't currently exist"},
        {"service": "Bitbucket", "cname": "bitbucket.io", "error": "Repository not found"},
        {"service": "Ghost", "cname": "ghost.io", "error": "The thing you're looking for is no longer here"},
        {"service": "Cargo", "cname": "cargocollective.com", "error": "404 Not Found"},
    ]
    
    # We check the root domain CNAME (unlikely but possible) 
    # In a real scenario, this tool would accept a list of subdomains found by other tools.
    # For now, we'll check the target itself and www.
    
    targets = [domain, f"www.{domain}", f"dev.{domain}", f"blog.{domain}"]
    
    for host in targets:
        try:
            results["checked"].append(host)
            answers = dns.resolver.resolve(host, 'CNAME')
            for rdata in answers:
                cname = str(rdata.target).rstrip('.')
                
                # Check if CNAME points to a known service
                for sig in signatures:
                    if sig["cname"] in cname:
                        # Potential Takeover!
                        # We found a CNAME pointing to a provider.
                        # We mark it as 'Potential' - confirming requires HTTP check which we skip for speed/safety.
                        results["vulnerable"].append({
                            "host": host,
                            "cname": cname,
                            "service": sig["service"],
                            "status": "POTENTIAL (Dangling CNAME?)"
                        })
                        results["safe"] = False
        except Exception:
            pass
            
    return results
