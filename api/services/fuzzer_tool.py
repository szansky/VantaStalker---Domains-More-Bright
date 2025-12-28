import aiohttp
import asyncio
from typing import Dict, Any, List

# Common paths (Top ~50 for speed)
# In a real tool this would load from a large wordlist
COMMON_PATHS = [
    ".env", ".git", ".DS_Store", "admin", "login", "dashboard", "api", "test",
    "backup", "wp-admin", "config", "db", "database", "user", "users",
    "dev", "staging", "beta", "monitor", "status", "metrics", "health",
    "portal", "auth", "oauth", "secure", "private", "robot.txt", "sitemap.xml",
    "shell", "cmd", "upload", "uploads", "files", "assets", "static", "public",
    "dist", "build", "src", "server", "app", "application", "v1", "v2",
    "swagger", "docs", "manual", "info", "phpinfo.php", "version"
]

async def check_path(session, base_url, path):
    url = f"{base_url}/{path}"
    try:
        async with session.get(url, allow_redirects=False, timeout=3) as response:
            if response.status in [200, 301, 302, 403]:
               return {
                   "path": path,
                   "status": response.status,
                   "url": url
               }
    except:
        pass
    return None

async def run_fuzzer(domain: str) -> Dict[str, Any]:
    base_url = f"https://{domain}"
    results = {
        "found": [],
        "scanned_count": len(COMMON_PATHS)
    }
    
    async with aiohttp.ClientSession() as session:
        tasks = [check_path(session, base_url, path) for path in COMMON_PATHS]
        responses = await asyncio.gather(*tasks)
        
        # Filter None
        found = [r for r in responses if r is not None]
        
        # Sort by status
        found.sort(key=lambda x: x["status"])
        
        results["found"] = found
        
    return results

# Sync wrapper
def fuzz_directories(domain: str) -> Dict[str, Any]:
    try:
        return asyncio.run(run_fuzzer(domain))
    except Exception as e:
        return {"error": str(e), "found": []}
