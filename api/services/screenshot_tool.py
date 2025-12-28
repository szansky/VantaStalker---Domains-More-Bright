import subprocess
import os
from typing import Dict, Any

def get_screenshot_sync(domain: str) -> Dict[str, Any]:
    """
    Captures screenshot by calling the Node.js puppeteer script.
    Fallback since Python pip is missing/broken in this env.
    """
    url = f"https://{domain}"
    results = {
        "screenshot_base64": None,
        "success": False
    }
    
    script_path = os.path.join(os.path.dirname(__file__), "../screenshot_service/screenshot.js")
    
    try:
        # Call node script
        process = subprocess.run(
            ["node", script_path, url],
            capture_output=True,
            text=True,
            timeout=20
        )
        
        if process.returncode == 0:
            base64_data = process.stdout.strip()
            if len(base64_data) > 100: # Basic validation
                results["screenshot_base64"] = base64_data
                results["success"] = True
            else:
                results["error"] = "Output too short or invalid"
        else:
            results["error"] = process.stderr.strip() or "Unknown verification error"
            
    except Exception as e:
        results["error"] = str(e)
        
    return results
