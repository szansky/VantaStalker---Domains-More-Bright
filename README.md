# VantaStalker 🕵️‍♂️

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

### 🛡️ Vulnerability Hunting
*   **CVE Mapper**: Automatically map detected technologies to known vulnerabilities (NIST NVD).
*   **Breach Radar**: Check discovered emails against known data leaks.
*   **Misconfiguration Scanner**: Detect missing security headers, open git environments, and exposed cloud buckets.
*   **Subdomain Takeover**: Identify potential takeover vulnerabilities on dangling CNAMEs.

### ⚡ Advanced Tools
*   **WAF Detector**: Identify Web Application Firewalls protecting the target.
*   **Port Scanner**: Fast checking of common service ports.
*   **Google Dorks**: Automated generation of targeted search queries.
*   **Chaos Fuzzer**: Provoke server errors to leak internal paths and credentials.

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

## ⚠️ Disclaimer

**VantaStalker is intended for educational purposes and authorized security testing only.**
Using this tool to scan targets without prior mutual consent is illegal. The developers assume no liability and are not responsible for any misuse or damage caused by this program.

---
*Built with code and caffeine.* ☕
