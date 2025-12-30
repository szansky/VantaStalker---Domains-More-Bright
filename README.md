# VantaStalker 

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20FastAPI-green)

> **Modern OSINT & Reconnaissance framework for pentesters. Automates attack surface mapping, CVE detection, and vulnerability scanning with a sleek React UI.**

VantaStalker is an all-in-one Web Intelligence Dashboard designed to illuminate the shadows of any target domain. It combines automated reconnaissance tools with deep intelligence gathering to provide actionable insights for penetration testers and security researchers.

## 🚀 Features

### 🔍 Intelligence Gathering
*   **Infrastructure Mapping**: Visualize subdomains, IP addresses, and hosting providers.
*   **Tech Stack Analysis**: Detect CMS, server software, and frameworks (Wappalyzer-style).
*   **Metadata Stalker**: Extract authors, users, and software versions from public documents (PDF, DOCX, XLSX).
*   **Creator Identification**: Hunt for developer comments, leaked stack traces, and shared Analytics IDs (Reverse Analytics).
*   **API Discovery**: Finds common API and admin endpoints (e.g., `/api`, `/swagger`, `/openapi.json`).

### 🛡️ Vulnerability Hunting
*   **CVE Mapper**: Automatically map detected technologies to known vulnerabilities (NIST NVD).
*   **Breach Radar**: Check discovered emails against known data leaks.
*   **Misconfiguration Scanner**: Detect missing security headers, open git environments, and exposed cloud buckets.
*   **Subdomain Takeover**: Identify potential takeover vulnerabilities on dangling CNAMEs.
*   **Open Redirect + Host Header**: Quick heuristics for redirect abuse and host header injection.

### ⚡ Advanced Tools
*   **WAF Detector**: Identify Web Application Firewalls protecting the target.
*   **Port Scanner**: Fast checking of common service ports.
*   **Google Dorks**: Automated generation of targeted search queries.
*   **Chaos Fuzzer**: Provoke server errors to leak internal paths and credentials.
*   **TLS Scanner**: Protocol support, weak version detection, and weak cipher checks.
*   **DNS Security**: SPF/DMARC/DKIM status, DNSSEC, and zone transfer check.
*   **Email Spoofing Risk**: Policy strength and alignment checks.
*   **Header Quality**: Security header grading with recommendations.
*   **Visual Change Alerts**: Screenshot hash changes between scans.

### 🧭 Workflow & Reporting
*   **Case Management**: Group scans by case, add tags, and export case ZIPs.
*   **Scan History**: Per-domain timeline with JSON snapshots and diffs.
*   **Snapshot Compare**: Compare two timestamps and review differences.
*   **Exports**: JSON/HTML reports and shareable summary.
*   **Background Jobs**: Non-blocking scans via job queue.
*   **Normalization + Scoring**: Unified schema with correlations and risk scoring.

### 🔒 Safety Controls
*   **SSRF Guard**: Blocks local/private targets by default.
*   **Allow/Deny Lists**: Optional allowlist/denylist for targets.
*   **Cache TTL**: Reuse recent results to reduce repeated scans.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TailwindCSS, Framer Motion
*   **Backend**: Python (FastAPI), Uvicorn
*   **Deployment**: Docker & Docker Compose

## 📦 Installation & Usage

The easiest way to run VantaStalker is using Docker.

### Prerequisites
*   Docker & Docker Compose

### Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/vantastalker.git
    cd vantastalker
    ```

2.  Start the application:
    ```bash
    docker compose up --build
    ```

3.  Access the dashboard:
    *   **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser.
    *   **API Docs**: Available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Local Dev (without Docker)
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r api/requirements.txt
cd api && uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

```bash
cd web
npm install
npm run dev
```

### Configuration
Set these environment variables if needed:
*   `ALLOW_PRIVATE_TARGETS=true|false` (default false)
*   `TARGET_ALLOWLIST=example.com,.mycompany.com`
*   `TARGET_DENYLIST=localhost,127.0.0.1,0.0.0.0,.local`
*   `CACHE_TTL_SECONDS=600` (default 0)

## ⚠️ Disclaimer

**VantaStalker is intended for educational purposes and authorized security testing only.**
Using this tool to scan targets without prior mutual consent is illegal. The developers assume no liability and are not responsible for any misuse or damage caused by this program.

---
*Built with code and caffeine.* ☕
