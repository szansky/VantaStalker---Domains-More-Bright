import ssl
import socket
from datetime import datetime
from typing import Dict, Any

def get_ssl_details(domain: str) -> Dict[str, Any]:
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                
                # Helper to format X509 components
                def get_component(obj, key):
                     # obj is like ((('commonName', 'example.com'),),)
                     for item in obj:
                         if item[0][0] == key:
                             return item[0][1]
                     return None

                subject = {item[0][0]: item[0][1] for item in cert.get('subject', []) for item in item}
                issuer = {item[0][0]: item[0][1] for item in cert.get('issuer', []) for item in item}
                
                # SANs
                sans = [item[1] for item in cert.get('subjectAltName', []) if item[0] == 'DNS']

                # Calculate Days to Expiry
                not_after_str = cert.get('notAfter')
                days_to_expiry = None
                if not_after_str:
                    try:
                        # Format: 'May 25 23:59:59 2025 GMT'
                        not_after = datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z")
                        days_to_expiry = (not_after - datetime.now()).days
                    except:
                        pass
                
                # TLS Version & Cipher (ssock.cipher() returns ('ECDHE-RSA-AES256-GCM-SHA384', 'TLSv1.3', 256))
                cipher_info = ssock.cipher()

                return {
                    "valid": True,
                    "subject": subject,
                    "issuer": issuer,
                    "version": cert.get('version'),
                    "serialNumber": cert.get('serialNumber'),
                    "notBefore": cert.get('notBefore'),
                    "notAfter": cert.get('notAfter'),
                    "days_to_expiry": days_to_expiry,
                    "subjectAltName": sans,
                    "cipher_name": cipher_info[0] if cipher_info else "Unknown",
                    "tls_version": cipher_info[1] if cipher_info else "Unknown",
                    "cipher_bits": cipher_info[2] if cipher_info else None
                }
    except Exception as e:
        return {"valid": False, "error": str(e)}
