import concurrent.futures
import ipaddress
import os
import socket
from datetime import datetime
from typing import Any, Dict, Optional

from services.archive_tool import get_archive_history
from services.cloud_enum_tool import check_cloud_buckets
from services.comment_tool import analyze_comments
from services.cors_tool import check_cors
from services.crtsh_tool import get_crtsh_subdomains
from services.dns_tool import get_dns_details
from services.dnsbl_tool import check_dnsbl
from services.email_harvester_tool import harvest_emails
from services.favicon_tool import get_favicon_hash
from services.fuzzer_tool import fuzz_directories
from services.geo_tool import get_geo_details
from services.ghost_track_tool import analyze_ghost_track
from services.git_env_tool import scan_git_env
from services.google_dork_tool import generate_dorks
from services.handle_hunter_tool import check_handles
from services.http_tool import analyze_http
from services.internetdb_tool import internetdb_lookup
from services.js_secrets_tool import scan_js_secrets
from services.metadata_stalker_tool import extract_metadata
from services.port_tool import scan_ports
from services.reverse_ip_tool import reverse_ip_lookup
from services.robots_tool import analyze_robots_sitemap
from services.screenshot_tool import get_screenshot_sync
from services.security_txt_tool import get_security_txt
from services.ssl_tool import get_ssl_details
from services.subdomain_tool import get_subdomains
from services.takeover_tool import check_subdomain_takeover
from services.tech_tool import analyze_tech
from services.trace_tool import trigger_trace
from services.waf_tool import detect_waf
from services.whois_tool import get_whois_details
from services.crawler_tool import crawl_site
from services.dns_security_tool import check_dns_security
from services.dnssec_tool import check_dnssec
from services.header_quality_tool import analyze_header_quality
from services.api_discovery_tool import discover_api_endpoints
from services.spoofing_risk_tool import analyze_spoofing_risk
from services.redirect_check_tool import check_open_redirect, check_host_header_injection
from services.cname_takeover_tool import check_cname_takeover
from services.tls_scan_tool import scan_tls_versions
from services.tls_deep_tool import scan_tls_ciphers
from services.robots_security_tool import analyze_robots_security, analyze_security_txt

from services.history_tool import compare_with_latest, get_latest_snapshot, save_snapshot
from services.normalize_tool import normalize_snapshot
from services.case_tool import assign_scan
from services.job_queue import update_job
from services.alerts_tool import build_alerts


def _utc_now() -> str:
    return datetime.utcnow().isoformat() + "Z"


def run_scan_job(job_id: str, target: str, case_id: Optional[str] = None) -> None:
    update_job(job_id, {"status": "in_progress"})

    tools: Dict[str, Any] = {}
    progress: Dict[str, str] = {}

    def mark(key: str, status: str) -> None:
        progress[key] = status
        update_job(job_id, {"progress": dict(progress), "tools": dict(tools)})

    try:
        cache_ttl = int(os.getenv("CACHE_TTL_SECONDS", "0"))
        if cache_ttl > 0:
            latest = get_latest_snapshot(target)
            if latest:
                collected_at = latest.get("collected_at") or ""
                try:
                    ts = datetime.fromisoformat(collected_at.replace("Z", ""))
                except ValueError:
                    ts = None
                if ts:
                    age = (datetime.utcnow() - ts).total_seconds()
                    if age <= cache_ttl:
                        update_job(job_id, {
                            "status": "completed",
                            "tools": latest.get("tools", {}),
                            "snapshot": latest,
                            "normalized": latest.get("normalized"),
                            "diff": {"has_previous": False},
                            "saved": None,
                            "cached": True
                        })
                        return
        is_ip = False
        try:
            ipaddress.ip_address(target)
            is_ip = True
        except ValueError:
            is_ip = False

        task_map = {}
        ip_for_internetdb = target
        try:
            if not is_ip:
                ip_for_internetdb = socket.gethostbyname(target)
        except Exception:
            ip_for_internetdb = target

        with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
            if is_ip:
                task_map["geo"] = executor.submit(get_geo_details, target)
                task_map["ports"] = executor.submit(scan_ports, target)
                task_map["reverseip"] = executor.submit(reverse_ip_lookup, target)
                task_map["internetdb"] = executor.submit(internetdb_lookup, target)
            else:
                task_map["dns"] = executor.submit(get_dns_details, target)
                task_map["whois"] = executor.submit(get_whois_details, target)
                task_map["http"] = executor.submit(analyze_http, target)
                task_map["ssl"] = executor.submit(get_ssl_details, target)
                task_map["tech"] = executor.submit(analyze_tech, target)
                task_map["subdomains"] = executor.submit(get_subdomains, target)
                task_map["ports"] = executor.submit(scan_ports, target)
                task_map["history"] = executor.submit(get_archive_history, target)
                task_map["ghost"] = executor.submit(analyze_ghost_track, target)
                task_map["metadata"] = executor.submit(extract_metadata, target)
                task_map["handles"] = executor.submit(check_handles, target)
                task_map["reverseip"] = executor.submit(reverse_ip_lookup, target)
                task_map["crtsh"] = executor.submit(get_crtsh_subdomains, target)
                task_map["robots"] = executor.submit(analyze_robots_sitemap, target)
                task_map["securitytxt"] = executor.submit(get_security_txt, target)
                task_map["favicon"] = executor.submit(get_favicon_hash, target)
                task_map["dnsbl"] = executor.submit(check_dnsbl, target)
                task_map["dns_security"] = executor.submit(check_dns_security, target)
                task_map["dnssec"] = executor.submit(check_dnssec, target)
                task_map["robots_security"] = executor.submit(analyze_robots_security, target)
                task_map["securitytxt_quality"] = executor.submit(analyze_security_txt, target)
                task_map["jssecrets"] = executor.submit(scan_js_secrets, target)
                task_map["email"] = executor.submit(harvest_emails, target)
                task_map["spoofing_risk"] = executor.submit(analyze_spoofing_risk, target)
                task_map["cloud"] = executor.submit(check_cloud_buckets, target)
                task_map["internetdb"] = executor.submit(internetdb_lookup, ip_for_internetdb)
                task_map["screenshot"] = executor.submit(get_screenshot_sync, target)
                task_map["gitenv"] = executor.submit(scan_git_env, target)
                task_map["takeover"] = executor.submit(check_subdomain_takeover, target)
                task_map["cname_takeover"] = executor.submit(check_cname_takeover, target)
                task_map["waf"] = executor.submit(detect_waf, target)
                task_map["tls"] = executor.submit(scan_tls_versions, target)
                task_map["tls_ciphers"] = executor.submit(scan_tls_ciphers, target)
                task_map["header_quality"] = executor.submit(analyze_header_quality, target)
                task_map["fuzzer"] = executor.submit(fuzz_directories, target)
                task_map["crawler"] = executor.submit(crawl_site, target)
                task_map["cors"] = executor.submit(check_cors, target)
                task_map["dorks"] = executor.submit(generate_dorks, target)
                task_map["api_discovery"] = executor.submit(discover_api_endpoints, target)
                task_map["open_redirect"] = executor.submit(check_open_redirect, target)
                task_map["host_header"] = executor.submit(check_host_header_injection, target)
                task_map["comments"] = executor.submit(analyze_comments, target)
                task_map["trace"] = executor.submit(trigger_trace, target)

            for key in task_map.keys():
                mark(key, "pending")

            for future in concurrent.futures.as_completed(task_map.values()):
                key = None
                for k, v in task_map.items():
                    if v == future:
                        key = k
                        break
                try:
                    data = future.result()
                except Exception as exc:
                    data = {"error": str(exc)}
                if key:
                    tools[key] = data
                    mark(key, "done")

        # Post-processing for geo if domain
        if not is_ip and tools.get("dns", {}).get("resolved_ip"):
            try:
                tools["geo"] = get_geo_details(tools["dns"]["resolved_ip"])
                mark("geo", "done")
            except Exception as exc:
                tools["geo"] = {"error": str(exc)}
                mark("geo", "done")

        snapshot = {
            "target": target,
            "collected_at": _utc_now(),
            "tools": tools
        }
        normalized = normalize_snapshot(snapshot)
        snapshot["normalized"] = normalized
        previous = get_latest_snapshot(target)
        if previous:
            alerts = build_alerts(previous, snapshot)
        else:
            alerts = []
        snapshot["alerts"] = alerts
        diff = compare_with_latest(target, snapshot)
        saved = save_snapshot(target, snapshot)
        if case_id:
            assign_scan(case_id, target, saved["timestamp"])

        update_job(job_id, {
            "status": "completed",
            "tools": tools,
            "snapshot": snapshot,
            "normalized": normalized,
            "diff": diff,
            "saved": saved,
            "alerts": alerts
        })
    except Exception as exc:
        update_job(job_id, {"status": "failed", "error": str(exc), "tools": tools})
