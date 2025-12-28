import dns.resolver
from typing import Dict, Any, List

def get_dns_details(domain: str) -> Dict[str, Any]:
    records = {
        "A": [],
        "AAAA": [],
        "MX": [],
        "NS": [],
        "TXT": [],
        "SOA": [],
        "CNAME": []
    }
    
    resolver = dns.resolver.Resolver()
    # Use Google & Cloudflare DNS
    resolver.nameservers = ['8.8.8.8', '8.8.4.4', '1.1.1.1'] 

    for rtype in records.keys():
        try:
            answers = resolver.resolve(domain, rtype, lifetime=2.0)
            for rdata in answers:
                records[rtype].append(rdata.to_text())
        except Exception:
            pass
            
    # Deep DMARC Check
    dmarc_record = None
    try:
        dmarc_answers = resolver.resolve(f"_dmarc.{domain}", "TXT", lifetime=2.0)
        for rdata in dmarc_answers:
            txt = rdata.to_text()
            if "v=DMARC1" in txt:
                dmarc_record = txt.strip('"')
    except Exception:
        pass

    # Deep SPF Check
    spf_record = None
    if records["TXT"]:
        for txt in records["TXT"]:
             clean_txt = txt.strip('"')
             if "v=spf1" in clean_txt:
                 spf_record = clean_txt
                 break

    return {
        "records": records,
        "dmarc": dmarc_record,
        "spf": spf_record,
        # Helper for frontend
        "resolved_ip": records["A"][0] if records["A"] else None
    }
