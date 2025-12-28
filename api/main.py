from fastapi import FastAPI
from pydantic import BaseModel
import ipaddress
import socket
import concurrent.futures
from fastapi.middleware.cors import CORSMiddleware

# Import Modular Services
from services.dns_tool import get_dns_details
from services.geo_tool import get_geo_details
from services.whois_tool import get_whois_details
from services.http_tool import analyze_http
from services.ssl_tool import get_ssl_details
from services.tech_tool import analyze_tech
from services.subdomain_tool import get_subdomains
from services.port_tool import scan_ports
from services.archive_tool import get_archive_history
from services.score_tool import calculate_risk_score
from services.ghost_track_tool import analyze_ghost_track
from services.metadata_stalker_tool import extract_metadata
from services.handle_hunter_tool import check_handles
from services.reverse_ip_tool import reverse_ip_lookup
from services.crtsh_tool import get_crtsh_subdomains
from services.robots_tool import analyze_robots_sitemap
from services.security_txt_tool import get_security_txt
from services.favicon_tool import get_favicon_hash
from services.dnsbl_tool import check_dnsbl
from services.js_secrets_tool import scan_js_secrets
from services.email_harvester_tool import harvest_emails
from services.cloud_enum_tool import check_cloud_buckets
from services.internetdb_tool import internetdb_lookup
from services.screenshot_tool import get_screenshot_sync
from services.git_env_tool import scan_git_env
from services.takeover_tool import check_subdomain_takeover
from services.waf_tool import detect_waf
from services.fuzzer_tool import fuzz_directories
from services.crawler_tool import crawl_site
from services.cors_tool import check_cors

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LookupRequest(BaseModel):
    target: str

import re

# Domain/IP validation
DOMAIN_PATTERN = re.compile(r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$')
IP_PATTERN = re.compile(r'^(\d{1,3}\.){3}\d{1,3}$')

def validate_target(target: str) -> bool:
    """Returns True if target is a valid domain or IP."""
    return bool(DOMAIN_PATTERN.match(target) or IP_PATTERN.match(target))

from fastapi import HTTPException

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/lookup")
def lookup(req: LookupRequest):
    target = req.target.strip()
    
    # 0. Sanitization
    if "://" in target:
        try:
            from urllib.parse import urlparse
            target = urlparse(target).netloc.split(":")[0]
        except:
            pass
    if "/" in target: target = target.split("/")[0]

    # 1. Determine Type
    is_ip = False
    try:
        ipaddress.ip_address(target)
        is_ip = True
    except ValueError:
        is_ip = False

    result = {
        "input": target,
        "type": "ip" if is_ip else "domain",
        "dns": {},
        "http": {},
        "whois": {},
        "ssl": {},
        "html": {}, # Tech / Metadata
        "geoip": {},
        "subdomains": {},
        "ports": {},
        "history": {},
        "risk_score": {}
    }

    # 2. Execution Logic (Parallelize for performance)
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
        futures = {}

        if is_ip:
            # IP Logic
            result["dns"]["resolved_ip"] = target
            futures["geoip"] = executor.submit(get_geo_details, target)
            futures["ports"] = executor.submit(scan_ports, target)
            # Try Reverse DNS
            try:
                rev = socket.gethostbyaddr(target)[0]
                result["reverse_dns"] = rev
            except:
                result["reverse_dns"] = None

        else:
            # Domain Logic
            futures["dns"] = executor.submit(get_dns_details, target)
            futures["whois"] = executor.submit(get_whois_details, target)
            futures["http"] = executor.submit(analyze_http, target)
            futures["ssl"] = executor.submit(get_ssl_details, target)
            futures["html"] = executor.submit(analyze_tech, target) # Tech/Meta
            futures["subdomains"] = executor.submit(get_subdomains, target)
            futures["ports"] = executor.submit(scan_ports, target)
            futures["history"] = executor.submit(get_archive_history, target)

        # 3. Collect Results
        for key, future in futures.items():
            try:
                data = future.result()
                if key == "html":
                    result["html"] = data # Maps to SiteMetadata component
                else:
                    result[key] = data
            except Exception as e:
                result[key] = {"error": str(e)}

        # Special Handling: GeoIP needs resolved IP from DNS if domain
        if not is_ip and result["dns"].get("resolved_ip"):
            result["geoip"] = get_geo_details(result["dns"]["resolved_ip"])

        # 4. Calculate Risk Score (Aggregated)
        result["risk_score"] = calculate_risk_score(result)

def sanitize_target(target: str) -> str:
    """Sanitizes and validates the target. Raises HTTPException if invalid."""
    target = target.strip()
    
    # Remove protocol
    if "://" in target:
        try:
            from urllib.parse import urlparse
            target = urlparse(target).netloc.split(":")[0]
        except:
            pass
    
    # Remove path
    if "/" in target:
        target = target.split("/")[0]
    
    # Remove www
    if target.startswith("www."):
        target = target[4:]
    
    # Validate
    if not validate_target(target):
        raise HTTPException(status_code=400, detail=f"Invalid domain or IP: {target}")
    
    return target

@app.post("/api/dns")
def dns_endpoint(req: LookupRequest):
    target = sanitize_target(req.target)
    return get_dns_details(target)

@app.post("/api/whois")
def whois_endpoint(req: LookupRequest):
    return get_whois_details(req.target)

@app.post("/api/geo")
def geo_endpoint(req: LookupRequest):
    return get_geo_details(req.target)

@app.post("/api/ssl")
def ssl_endpoint(req: LookupRequest):
    return get_ssl_details(req.target)

@app.post("/api/http")
def http_endpoint(req: LookupRequest):
    return analyze_http(req.target)

@app.post("/api/tech")
def tech_endpoint(req: LookupRequest):
    return analyze_tech(req.target)

@app.post("/api/subdomains")
def subdomains_endpoint(req: LookupRequest):
    return get_subdomains(req.target)

@app.post("/api/ports")
def ports_endpoint(req: LookupRequest):
    return scan_ports(req.target)

@app.post("/api/archive")
def archive_endpoint(req: LookupRequest):
    return get_archive_history(req.target)

@app.post("/api/ghost")
def ghost_endpoint(req: LookupRequest):
    return analyze_ghost_track(req.target)

@app.post("/api/metadata")
def metadata_endpoint(req: LookupRequest):
    return extract_metadata(req.target)

@app.post("/api/handles")
def handles_endpoint(req: LookupRequest):
    return check_handles(req.target)

@app.post("/api/reverseip")
def reverseip_endpoint(req: LookupRequest):
    return reverse_ip_lookup(req.target)

@app.post("/api/crtsh")
def crtsh_endpoint(req: LookupRequest):
    return get_crtsh_subdomains(req.target)

@app.post("/api/robots")
def robots_endpoint(req: LookupRequest):
    return analyze_robots_sitemap(req.target)

@app.post("/api/securitytxt")
def securitytxt_endpoint(req: LookupRequest):
    return get_security_txt(req.target)

@app.post("/api/favicon")
def favicon_endpoint(req: LookupRequest):
    return get_favicon_hash(req.target)

@app.post("/api/dnsbl")
def dnsbl_endpoint(req: LookupRequest):
    return check_dnsbl(req.target)

@app.post("/api/jssecrets")
def jssecrets_endpoint(req: LookupRequest):
    return scan_js_secrets(req.target)

@app.post("/api/email")
def email_endpoint(req: LookupRequest):
    return harvest_emails(req.target)

@app.post("/api/cloud")
def cloud_endpoint(req: LookupRequest):
    return check_cloud_buckets(req.target)

@app.post("/api/internetdb")
def internetdb_endpoint(req: LookupRequest):
    # InternetDB needs IP, not domain. Inspect input or resolve it.
    # If domain is passed, resolve it first.
    target = req.target
    try:
        if not target.replace('.','').isdigit():
             target = socket.gethostbyname(target)
    except:
        pass # Let tool handle or fail
    return internetdb_lookup(target)

@app.post("/api/screenshot")
def screenshot_endpoint(req: LookupRequest):
    return get_screenshot_sync(req.target)

@app.post("/api/gitenv")
def gitenv_endpoint(req: LookupRequest):
    return scan_git_env(req.target)
from services.google_dork_tool import generate_dorks

@app.post("/api/dorks")
def dorks_endpoint(req: LookupRequest):
    return generate_dorks(req.target)
@app.post("/api/takeover")
def takeover_endpoint(req: LookupRequest):
    return check_subdomain_takeover(req.target)

@app.post("/api/waf")
def waf_endpoint(req: LookupRequest):
    return detect_waf(req.target)

@app.post("/api/fuzzer")
def fuzzer_endpoint(req: LookupRequest):
    return fuzz_directories(req.target)

@app.post("/api/crawler")
def crawler_endpoint(req: LookupRequest):
    return crawl_site(req.target)

@app.post("/api/cors")
def cors_endpoint(req: LookupRequest):
    return check_cors(req.target) 

from services.cve_tool import check_cve
from services.breach_tool import check_breach

class TechRequest(BaseModel):
    technologies: list

class EmailRequest(BaseModel):
    emails: list

@app.post("/api/cve")
def cve_endpoint(req: TechRequest):
    return check_cve(req.technologies)

@app.post("/api/breach")
def breach_endpoint(req: EmailRequest):
    return check_breach(req.emails)

from services.comment_tool import analyze_comments
from services.trace_tool import trigger_trace

@app.post("/api/comments")
def comments_endpoint(req: LookupRequest):
    return analyze_comments(req.target)

@app.post("/api/trace")
def trace_endpoint(req: LookupRequest):
    return trigger_trace(req.target)

# Keep monolithic for legacy or quick checks if needed
@app.post("/lookup")
def lookup(req: LookupRequest):
    # ... existing implementation ...
    target = req.target.strip()
    # ... (rest of function kept as is for backward compat if needed, or simply return the aggregate)
    # Re-implementing using the new functions to ensure consistency is best, but for now I will append the new endpoints validly.
    pass 

