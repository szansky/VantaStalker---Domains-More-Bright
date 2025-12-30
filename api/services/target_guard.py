import ipaddress
import os
import socket
from typing import List


def _split_list(value: str) -> List[str]:
    return [v.strip().lower() for v in value.split(",") if v.strip()]


ALLOW_PRIVATE = os.getenv("ALLOW_PRIVATE_TARGETS", "false").lower() == "true"
ALLOWLIST = _split_list(os.getenv("TARGET_ALLOWLIST", ""))
DENYLIST = _split_list(os.getenv("TARGET_DENYLIST", "localhost,127.0.0.1,0.0.0.0"))


def _matches_list(target: str, entries: List[str]) -> bool:
    t = target.lower()
    for entry in entries:
        if t == entry:
            return True
        if entry.startswith(".") and t.endswith(entry):
            return True
    return False


def _is_private_ip(ip: str) -> bool:
    try:
        obj = ipaddress.ip_address(ip)
        return (
            obj.is_private
            or obj.is_loopback
            or obj.is_link_local
            or obj.is_reserved
            or obj.is_multicast
        )
    except ValueError:
        return False


def guard_target(target: str) -> None:
    if _matches_list(target, DENYLIST):
        raise ValueError("Target is denied by policy.")
    if ALLOWLIST and not _matches_list(target, ALLOWLIST):
        raise ValueError("Target is not in allowlist.")
    if target.endswith(".local"):
        raise ValueError("Local domains are blocked.")

    # If domain, resolve and block private targets unless allowed.
    try:
        ip = socket.gethostbyname(target)
        if _is_private_ip(ip) and not ALLOW_PRIVATE:
            raise ValueError("Private or local IPs are blocked.")
    except socket.gaierror:
        pass
