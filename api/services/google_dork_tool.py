from typing import Dict, Any, List
import urllib.parse

def generate_dorks(domain: str) -> Dict[str, Any]:
    """
    Generates a list of Google Dork links for the target domain.
    This avoids direct scraping (which gets blocked) and empowers the user
    to manually verify findings via their own browser.
    """
    
    # Common useful dorks
    dork_templates = [
        {"name": "Publicly Exposed Documents", "query": "site:{domain} ext:doc | ext:docx | ext:odt | ext:pdf | ext:rtf | ext:sxw | ext:psw | ext:ppt | ext:pptx | ext:pps | ext:csv", "desc": "Finds office documents and PDFs"},
        {"name": "Directory Listing Vulnerabilities", "query": "site:{domain} intitle:index.of", "desc": "Finds open directories"},
        {"name": "Configuration Files", "query": "site:{domain} ext:xml | ext:conf | ext:cnf | ext:reg | ext:inf | ext:rdp | ext:cfg | ext:txt | ext:ora | ext:ini", "desc": "Finds potentially sensitive config files"},
        {"name": "Database Files", "query": "site:{domain} ext:sql | ext:dbf | ext:mdb", "desc": "Finds exposed database dumps"},
        {"name": "Log Files", "query": "site:{domain} ext:log", "desc": "Finds exposed server logs"},
        {"name": "Backup and Old Files", "query": "site:{domain} ext:bkf | ext:bkp | ext:bak | ext:old | ext:backup", "desc": "Finds backup files"},
        {"name": "Login Pages", "query": "site:{domain} inurl:login", "desc": "Finds admin or user login portals"},
        {"name": "SQL Errors", "query": "site:{domain} intext:\"sql syntax near\" | intext:\"syntax error has occurred\" | intext:\"incorrect syntax near\" | intext:\"unexpected end of SQL command\" | intext:\"Warning: mysql_connect()\" | intext:\"Warning: mysql_query()\" | intext:\"truly wild\"", "desc": "Finds pages leaking SQL errors"},
        {"name": "PHP Errors", "query": "site:{domain} \"PHP Parse error\" | \"PHP Warning\" | \"PHP Error\"", "desc": "Finds exposed PHP errors"},
        {"name": "Wordpress", "query": "site:{domain} inurl:wp- | inurl:wp-content | inurl:plugins | inurl:uploads | inurl:themes | inurl:download", "desc": "Finds Wordpress installation files"},
        {"name": "Cloud Storage / Buckets", "query": "site:s3.amazonaws.com \"{domain}\"", "desc": "Finds AWS S3 buckets related to the domain"},
        {"name": "Code Leaks (Pastebin)", "query": "site:pastebin.com \"{domain}\"", "desc": "Finds mentions on Pastebin"},
        {"name": "Github Leaks", "query": "site:github.com \"{domain}\"", "desc": "Finds repositories or code on Github"},
        {"name": "StackOverflow Questions", "query": "site:stackoverflow.com \"{domain}\"", "desc": "Finds dev questions related to the domain"},
    ]

    results = []

    for dork in dork_templates:
        query = dork["query"].format(domain=domain)
        # Create Google Search URL
        encoded_query = urllib.parse.quote(query)
        url = f"https://www.google.com/search?q={encoded_query}"
        
        results.append({
            "name": dork["name"],
            "desc": dork["desc"],
            "url": url,
            "dork": query
        })

    return {
        "dorks": results,
        "count": len(results)
    }
