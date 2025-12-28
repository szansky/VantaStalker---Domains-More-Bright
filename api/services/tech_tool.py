import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, Any, List

def analyze_tech(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}"
    results = {
        "technologies": [],
        "metadata": {},
        "server": None,
        "headers": {},
        "social_links": [],
        "scam_analysis": {
            "score": 0,
            "matches": []
        },
        "potential_secrets": []
    }
    
    try:
        resp = requests.get(url, timeout=5, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        results["headers"] = dict(resp.headers)
        results["server"] = resp.headers.get("Server")
        
        soup = BeautifulSoup(resp.text, 'html.parser')
        html_lower = resp.text.lower()
        
        # 1. Metadata extraction
        if soup.title:
            results["metadata"]["title"] = soup.title.string.strip()
        
        for meta in soup.find_all('meta'):
            name = meta.get('name', '').lower()
            content = meta.get('content', '')
            if name in ['description', 'keywords', 'generator', 'author']:
                results["metadata"][name] = content

        # 2. Tech Detection (Signatures)
        tech_signatures = {
            "WordPress": ["wp-content", "wp-includes", "wordpress"],
            "React": ["react", "_react", "react-dom"],
            "Vue.js": ["vue", "__vue", "vue-router"],
            "Next.js": ["next", "__next"],
            "Nuxt.js": ["nuxt", "__nuxt"],
            "jQuery": ["jquery", "jquery.min.js"],
            "Bootstrap": ["bootstrap", "bootstrap.min.css"],
            "Tailwind CSS": ["tailwindcss", "tailwind"],
            "Google Analytics": ["google-analytics", "ga.js", "gtag"],
            "Cloudflare": ["__cfduid", "cf-ray"],
            "Vercel": ["vercel"],
            "Netlify": ["netlify"],
            "Shopify": ["shopify"],
            "WooCommerce": ["woocommerce"],
            "Laravel": ["laravel"],
            "Django": ["csrfmiddlewaretoken"],
            "Flask": ["flask"],
            "PHP": [".php"],
            "ASP.NET": ["asp.net", "viewstate"],
        }

        # Check in HTML/Scripts
        for tech, keywords in tech_signatures.items():
            for kw in keywords:
                if kw in html_lower:
                    results["technologies"].append(tech)
                    break
                    
        # 2.5 Version Detection (Regex)
        version_patterns = {
            "WordPress": r'content=["\']WordPress\s+([\d.]+)["\']',
            "Next.js": r'content=["\']Next\.js\s+([\d.]+)["\']',
            "Angular": r'ng-version=["\']([\d.]+)["\']',
            "jQuery": r'jquery[/-]([\d.]+)(?:\.min)?\.js',
            "Bootstrap": r'bootstrap[/-]([\d.]+)',
            "Laravel": r'laravel/([\d.]+)',
            "PHP": r'PHP/([\d.]+)',
            "Apache": r'Apache/([\d.]+)',
            "Nginx": r'nginx/([\d.]+)'
        }
        
        detected_versions = {}
        
        # Check Headers first for versions (Server, X-Powered-By)
        for header, val in resp.headers.items():
            for tech, pattern in version_patterns.items():
                match = re.search(pattern, val, re.IGNORECASE)
                if match:
                    detected_versions[tech] = match.group(1)
                    if tech not in results["technologies"]:
                        results["technologies"].append(tech)

        # Check HTML content
        for tech, pattern in version_patterns.items():
            if tech not in detected_versions: # Don't overwrite if found in headers
                match = re.search(pattern, resp.text, re.IGNORECASE)
                if match:
                    detected_versions[tech] = match.group(1)
                    if tech not in results["technologies"]:
                        results["technologies"].append(tech)

        # Merge versions into technologies list for display
        final_tech_list = []
        for tech in results["technologies"]:
            if tech in detected_versions:
                final_tech_list.append(f"{tech} (v{detected_versions[tech]})")
            else:
                final_tech_list.append(tech)
        
        results["technologies"] = final_tech_list
                    
        # 3. Social Media Extraction (Regex)
        social_patterns = {
            "Twitter/X": r'https?://(www\.)?(twitter\.com|x\.com)/[a-zA-Z0-9_]+',
            "Telegram": r'https?://(www\.)?t\.me/[a-zA-Z0-9_]+',
            "Discord": r'https?://(www\.)?discord\.(gg|com)/[a-zA-Z0-9]+',
            "GitHub": r'https?://(www\.)?github\.com/[a-zA-Z0-9_-]+',
            "LinkedIn": r'https?://(www\.)?linkedin\.com/(in|company)/[a-zA-Z0-9_-]+',
            "Instagram": r'https?://(www\.)?instagram\.com/[a-zA-Z0-9_.]+',
            "Facebook": r'https?://(www\.)?facebook\.com/[a-zA-Z0-9.]+'
        }
        
        for platform, pattern in social_patterns.items():
            # Use finditer to get full match objects
            matches = re.finditer(pattern, resp.text)
            for m in matches:
                url = m.group(0) # Full match
                results["social_links"].append(url)
                
        results["social_links"] = sorted(list(set(results["social_links"])))

        # 4. Content Analysis (Scam & Sensitivity)
        scam_keywords = [
            "guaranteed return", "risk-free", "double your investment", 
            "instant profit", "exclusive giveaway", "send eth to", "send btc to"
        ]
        sensitive_keywords = [
            "confidential", "internal use only", "proprietary", 
            "salary", "employee id", "passport", "ssn", "top secret",
            "do not distribute", "admin only"
        ]
        legal_keywords = ["gdpr", "privacy policy", "terms of service", "copyright"]
        
        scam_score = 0
        matches = []
        
        # Check Scam
        for kw in scam_keywords:
            if kw in html_lower:
                scam_score += 1
                matches.append(f"Scam: {kw}")
                
        # Check Sensitive
        for kw in sensitive_keywords:
            if kw in html_lower:
                matches.append(f"Sensitive: {kw}")
        
        # Penalize for lack of legal docs
        
        # Penalize for lack of legal docs
        has_legal = False
        for kw in legal_keywords:
            if kw in html_lower:
                has_legal = True
                break
        if not has_legal:
            matches.append("No Legal Docs Found")

        results["content_analysis"] = {
            "score": scam_score,
            "matches": matches
        }
        # Backwards compatibility if needed, but we'll update frontend
        results["scam_analysis"] = results["content_analysis"]

        # 5. Secrets Scanning (Basic)
        secret_patterns = [
            (r'AIza[0-9A-Za-z-_]{35}', "Google API Key"),
            (r'NEXT_PUBLIC_[A-Z_]+', "Exposed Env Var"),
            (r'ghp_[0-9a-zA-Z]{36}', "GitHub Personal Token"),
            (r'eyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+', "JWT Token"),
            (r'stripe_pk_[a-zA-Z0-9]+', "Stripe Publishable Key")
        ]
        
        for pat, name in secret_patterns:
            if re.search(pat, resp.text):
                results["potential_secrets"].append(name)
                
        # 6. Endpoint Discovery (Heuristic)
        # Search for common API patterns in JS/HTML
        endpoint_pattern = r"['\"](/api/v\d+|/graphql|/trpc|[a-zA-Z0-9/_.-]+/api/[a-zA-Z0-9/_.-]+)['\"]"
        endpoints = re.findall(endpoint_pattern, resp.text)
        
        # Filter and clean
        unique_endpoints = set()
        for ep in endpoints:
            if len(ep) < 100 and not ep.startswith("//"): # Simple noise filter
                unique_endpoints.add(ep)
        
        results["discovered_endpoints"] = sorted(list(unique_endpoints))

        # 7. Contact Info Extraction (Mailto/Tel)
        mail_matches = re.findall(r'mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', resp.text)
        tel_matches = re.findall(r'tel:([+\d\-\(\)\s]{7,})', resp.text)
        
        results["emails"] = list(set(mail_matches))
        results["phones"] = list(set(tel_matches))

    except Exception as e:
        results["error"] = str(e)
        
    return results
