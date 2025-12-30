import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const STATUS_LABELS = {
  dns: 'DNS',
  whois: 'WHOIS',
  geo: 'GeoIP',
  ssl: 'SSL',
  http: 'HTTP',
  tech: 'Tech',
  subdomains: 'Subdomains',
  ports: 'Ports',
  history: 'Archive',
  ghost: 'Ghost Track',
  metadata: 'Metadata',
  handles: 'Handle Hunter',
  reverseip: 'Reverse IP',
  crtsh: 'crt.sh',
  robots: 'Robots/Sitemap',
  securitytxt: 'security.txt',
  favicon: 'Favicon Hash',
  dnsbl: 'DNSBL',
  dns_security: 'DNS Security',
  dnssec: 'DNSSEC',
  robots_security: 'Robots Heuristics',
  securitytxt_quality: 'security.txt Quality',
  jssecrets: 'JS Secrets',
  email: 'Email Harvester',
  spoofing_risk: 'Spoofing Risk',
  cloud: 'Cloud Enum',
  internetdb: 'InternetDB',
  screenshot: 'Screenshot',
  gitenv: 'Git Env',
  takeover: 'Takeover',
  cname_takeover: 'CNAME Takeover',
  waf: 'WAF',
  tls: 'TLS Scan',
  tls_ciphers: 'Weak TLS Ciphers',
  header_quality: 'Header Quality',
  fuzzer: 'Dir Fuzzer',
  crawler: 'Crawler',
  cors: 'CORS',
  dorks: 'Google Dorks',
  api_discovery: 'API Discovery',
  open_redirect: 'Open Redirects',
  host_header: 'Host Header'
};

const statusBadge = (item) => {
  if (item.loading) return <Badge variant="info">Loading</Badge>;
  if (item.error) return <Badge variant="danger">Error</Badge>;
  if (item.data) return <Badge variant="success">Loaded</Badge>;
  return <Badge variant="default">Pending</Badge>;
};

const LoadingStatus = ({ state }) => {
  if (!state?.init) return null;

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-neutral-400">Loading status</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {Object.keys(STATUS_LABELS).map((key) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="text-neutral-300">{STATUS_LABELS[key]}</div>
              {statusBadge(state[key] || {})}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LoadingStatus;
