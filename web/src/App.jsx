import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchForm from './components/domain/SearchForm';
import TargetOverview from './components/domain/TargetOverview';
import DnsSection from './components/domain/DnsSection';
import WhoisInfo from './components/domain/WhoisInfo';
import GeoLocation from './components/domain/GeoLocation';
import SiteMetadata from './components/domain/SiteMetadata';
import SslInfo from './components/domain/SslInfo';
import HttpAnalyzer from './components/domain/HttpAnalyzer';
import SubdomainList from './components/domain/SubdomainList';
import PortScanner from './components/domain/PortScanner';
import Timeline from './components/domain/Timeline';
import EndpointMap from './components/domain/EndpointMap';
import SitePreview from './components/domain/SitePreview';
import SecurityGrade from './components/domain/SecurityGrade';
import GhostTrack from './components/domain/GhostTrack';
import MetadataStalker from './components/domain/MetadataStalker';
import HandleHunter from './components/domain/HandleHunter';
import ReverseIP from './components/domain/ReverseIP';
import CrtshSubdomains from './components/domain/CrtshSubdomains';
import RobotsAnalysis from './components/domain/RobotsAnalysis';
import SecurityTxt from './components/domain/SecurityTxt';
import FaviconHash from './components/domain/FaviconHash';
import DNSBLCheck from './components/domain/DNSBLCheck';
import JSSecrets from './components/domain/JSSecrets';
import EmailHarvester from './components/domain/EmailHarvester';
import CloudEnum from './components/domain/CloudEnum';
import InternetDB from './components/domain/InternetDB';
import ScreenshotTool from './components/domain/ScreenshotTool';
import GitEnvScanner from './components/domain/GitEnvScanner';
import TakeoverCheck from './components/domain/TakeoverCheck';
import WAFDetector from './components/domain/WAFDetector';
import DirFuzzer from './components/domain/DirFuzzer';
import SiteCrawler from './components/domain/SiteCrawler';
import CORSScanner from './components/domain/CORSScanner';
import GoogleDorks from './components/domain/GoogleDorks';
import NetworkMapper from './components/domain/NetworkMapper';
import CveMapper from './components/domain/CveMapper';
import BreachRadar from './components/domain/BreachRadar';
import TraceAnalyzer from './components/domain/TraceAnalyzer';
import CreatorIntel from './components/domain/CreatorIntel';
import SearchHistory from './components/domain/SearchHistory';
import LoadingStatus from './components/domain/LoadingStatus';
import CaseManager from './components/domain/CaseManager';
import NormalizedSummary from './components/domain/NormalizedSummary';
import ExportReport from './components/domain/ExportReport';
import AlertsPanel from './components/domain/AlertsPanel';
import SnapshotCompare from './components/domain/SnapshotCompare';
import CaseHistory from './components/domain/CaseHistory';
import TLSScanner from './components/domain/TLSScanner';
import DNSSecurity from './components/domain/DNSSecurity';
import HeaderQuality from './components/domain/HeaderQuality';
import DNSSECCheck from './components/domain/DNSSECCheck';
import RobotsSecurity from './components/domain/RobotsSecurity';
import SecurityTxtQuality from './components/domain/SecurityTxtQuality';
import TLSCiphers from './components/domain/TLSCiphers';
import ApiDiscovery from './components/domain/ApiDiscovery';
import SpoofingRisk from './components/domain/SpoofingRisk';
import RedirectCheck from './components/domain/RedirectCheck';
import HostHeaderCheck from './components/domain/HostHeaderCheck';
import CnameTakeover from './components/domain/CnameTakeover';
import Skeleton from './components/ui/Skeleton';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const TOOL_KEYS = [
  'dns',
  'whois',
  'geo',
  'ssl',
  'http',
  'tech',
  'subdomains',
  'ports',
  'history',
  'risk',
  'ghost',
  'metadata',
  'handles',
  'reverseip',
  'crtsh',
  'robots',
  'securitytxt',
  'favicon',
  'dnsbl',
  'dns_security',
  'dnssec',
  'robots_security',
  'securitytxt_quality',
  'jssecrets',
  'email',
  'spoofing_risk',
  'cloud',
  'internetdb',
  'screenshot',
  'gitenv',
  'takeover',
  'cname_takeover',
  'waf',
  'tls',
  'tls_ciphers',
  'header_quality',
  'fuzzer',
  'crawler',
  'dorks',
  'cors',
  'api_discovery',
  'open_redirect',
  'host_header',
];

// Helper Loading wrapper
const Loader = ({ loading, children, className = "h-48" }) => {
  if (loading) return <Skeleton variant="card" className={className} />;
  return children;
};

function App() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false); // Global loading for initial search state
  const [searchHistory, setSearchHistory] = useState({ loading: false, data: null });
  const [historyDiff, setHistoryDiff] = useState({ loading: false, data: null });
  const [cases, setCases] = useState([]);
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [normalizedSummary, setNormalizedSummary] = useState(null);
  const [lastSnapshot, setLastSnapshot] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [compareResult, setCompareResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const scanTimerRef = useRef(null);

  // Granular State
  const [state, setState] = useState({
    init: false, // Has a search started?
    dns: { loading: false, data: null },
    whois: { loading: false, data: null },
    geo: { loading: false, data: null },
    ssl: { loading: false, data: null },
    http: { loading: false, data: null },
    tech: { loading: false, data: null }, // HTML/Meta
    subdomains: { loading: false, data: null },
    ports: { loading: false, data: null },
    history: { loading: false, data: null },
    risk: { loading: false, data: null }, // Mocked or calc frontend-side for now, or separate endpoint
    ghost: { loading: false, data: null },
    metadata: { loading: false, data: null },
    handles: { loading: false, data: null },
    reverseip: { loading: false, data: null },
    crtsh: { loading: false, data: null },
    robots: { loading: false, data: null },
    securitytxt: { loading: false, data: null },
    favicon: { loading: false, data: null },
    dnsbl: { loading: false, data: null },
    dns_security: { loading: false, data: null },
    dnssec: { loading: false, data: null },
    robots_security: { loading: false, data: null },
    securitytxt_quality: { loading: false, data: null },
    jssecrets: { loading: false, data: null },
    email: { loading: false, data: null },
    spoofing_risk: { loading: false, data: null },
    cloud: { loading: false, data: null },
    internetdb: { loading: false, data: null },
    screenshot: { loading: false, data: null },
    gitenv: { loading: false, data: null },
    takeover: { loading: false, data: null },
    cname_takeover: { loading: false, data: null },
    waf: { loading: false, data: null },
    tls: { loading: false, data: null },
    tls_ciphers: { loading: false, data: null },
    header_quality: { loading: false, data: null },
    fuzzer: { loading: false, data: null },
    crawler: { loading: false, data: null },
    dorks: { loading: false, data: null },
    cors: { loading: false, data: null },
    api_discovery: { loading: false, data: null },
    open_redirect: { loading: false, data: null },
    host_header: { loading: false, data: null },
  });

  const apiBase = 'http://localhost:8000';

  const fetchHistoryList = async (domainInput) => {
    setSearchHistory({ loading: true, data: null });
    try {
      const res = await fetch(`${apiBase}/api/history/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: domainInput })
      });
      const json = await res.json();
      setSearchHistory({ loading: false, data: json });
      return json;
    } catch (err) {
      console.error('Error fetching history list:', err);
      setSearchHistory({ loading: false, data: null });
      return null;
    }
  };

  const resetToolState = () => {
    const resetState = { init: true };
    TOOL_KEYS.forEach((key) => {
      resetState[key] = { loading: true, data: null };
    });
    setState((prev) => ({ ...prev, ...resetState }));
  };

  const applyJobUpdate = (job) => {
    const tools = job.tools || {};
    setState((prev) => {
      const next = { ...prev };
      TOOL_KEYS.forEach((key) => {
        if (tools[key] !== undefined) {
          const item = tools[key];
          next[key] = { loading: false, data: item, error: item?.error };
        } else if (job.status === 'completed' && prev[key]?.loading) {
          next[key] = { ...prev[key], loading: false };
        }
      });
      return next;
    });

    if (job.normalized) setNormalizedSummary(job.normalized);
    if (job.diff) setHistoryDiff({ loading: false, data: job.diff });
    if (job.snapshot) setLastSnapshot(job.snapshot);
    if (job.alerts) setAlerts(job.alerts);
  };

  const pollScanJob = async (jobId, domainInput) => {
    try {
      const res = await fetch(`${apiBase}/api/scan/status/${jobId}`);
      if (!res.ok) throw new Error('Failed to fetch scan status');
      const json = await res.json();
      applyJobUpdate(json);
      if (json.status === 'completed' || json.status === 'failed') {
        if (scanTimerRef.current) clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
        setLoading(false);
        fetchHistoryList(domainInput);
        fetchCases();
        if (json.status === 'failed') {
          setState((prev) => {
            const next = { ...prev };
            TOOL_KEYS.forEach((key) => {
              if (next[key]?.loading) {
                next[key] = { ...next[key], loading: false };
              }
            });
            return next;
          });
        }
      }
    } catch (err) {
      console.error('Error polling scan job:', err);
    }
  };

  const startScan = async (domainInput) => {
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }

    resetToolState();
    setHistoryDiff({ loading: false, data: null });
    setNormalizedSummary(null);
    setLastSnapshot(null);
    setAlerts([]);
    setCompareResult(null);
    fetchHistoryList(domainInput);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/scan/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: domainInput, case_id: activeCaseId })
      });
      if (!res.ok) throw new Error('Failed to start scan');
      const json = await res.json();
      pollScanJob(json.job_id, domainInput);
      scanTimerRef.current = setInterval(() => {
        pollScanJob(json.job_id, domainInput);
      }, 2000);
    } catch (err) {
      console.error('Error starting scan:', err);
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await fetch(`${apiBase}/api/cases`);
      const json = await res.json();
      setCases(json.cases || []);
    } catch (err) {
      console.error('Error fetching cases:', err);
    }
  };

  const createCase = async (payload) => {
    try {
      const res = await fetch(`${apiBase}/api/cases/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.case?.id) {
        setActiveCaseId(json.case.id);
      }
      fetchCases();
    } catch (err) {
      console.error('Error creating case:', err);
    }
  };

  const exportCaseZip = async (caseId) => {
    try {
      const res = await fetch(`${apiBase}/api/cases/export/${caseId}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${caseId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting case:', err);
    }
  };

  const downloadSnapshot = async (domainInput, timestamp) => {
    try {
      const res = await fetch(`${apiBase}/api/history/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: domainInput, timestamp })
      });
      if (!res.ok) throw new Error('Snapshot download failed');
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json.snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${domainInput}_${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading snapshot:', err);
    }
  };

  const compareSnapshots = async (a, b) => {
    if (!domain) return;
    setCompareLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/history/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: domain, a, b })
      });
      if (!res.ok) throw new Error('Compare failed');
      const json = await res.json();
      setCompareResult(json);
    } catch (err) {
      console.error('Error comparing snapshots:', err);
    } finally {
      setCompareLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, []);

  const handleSearch = async (input) => {
    // Sanitization
    let cleanTarget = input.trim();
    cleanTarget = cleanTarget.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    setDomain(cleanTarget);
    startScan(cleanTarget);
  };

  const activeCase = cases.find((c) => c.id === activeCaseId) || null;

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">

        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setDomain('');
              setState(prev => ({ ...prev, init: false }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex flex-col items-center cursor-pointer hover:opacity-80 transition-all duration-500 hover:scale-105"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20" />
              <img src="/logo.png" alt="VantaStalker Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,1)]" />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              VANTASTALKER
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-500 uppercase tracking-[0.2em] text-sm font-bold"
            >
              Domains More Bright
            </motion.p>
          </a>
        </header>

        {/* Search */}
        <div className="mb-16">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Grid - Staggered Animation */}
        <AnimatePresence>
          {state.init && (
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >

              {/* TOP ROW: Large Preview & Key Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* Large Preview */}
                <motion.div variants={itemVariants} className="lg:col-span-1 h-full min-h-[400px]">
                  <SitePreview domain={domain} />
                </motion.div>

                {/* Key Stats Stack */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6">
                  <Loader loading={state.geo.loading}>
                    <TargetOverview data={{
                      ...state.geo.data,
                      domain: domain,
                      ip: state.dns.data?.resolved_ip || 'Scanning...'
                    }} />
                  </Loader>

                  <CaseManager
                    cases={cases}
                    activeCaseId={activeCaseId}
                    onSelectCase={setActiveCaseId}
                    onCreateCase={createCase}
                    onExportCase={exportCaseZip}
                  />

                  <CaseHistory activeCase={activeCase} onDownloadSnapshot={downloadSnapshot} />

                  <NormalizedSummary data={normalizedSummary} />

                  <AlertsPanel alerts={alerts} />

                  <LoadingStatus state={state} />

                  <Loader loading={searchHistory.loading}>
                    <SearchHistory history={searchHistory.data} diff={historyDiff.data} />
                  </Loader>

                  <SnapshotCompare
                    history={searchHistory.data}
                    diff={compareResult}
                    onCompare={compareSnapshots}
                    loading={compareLoading}
                  />

                  <ExportReport snapshot={lastSnapshot} normalized={normalizedSummary} />

                  {/* Temporary Placeholder for Risk until refactored */}
                  {/* <RiskScore ... /> can go here later */}

                  <Loader loading={state.dns.loading}>
                    <DnsSection data={state.dns.data || {}} />
                  </Loader>
                </motion.div>

              </div>

              {/* Strategic Map */}
              <motion.div variants={itemVariants} className="mb-6">
                <Loader loading={state.subdomains.loading || state.tech.loading}>
                  <NetworkMapper
                    domain={domain}
                    ip={state.dns.data?.resolved_ip}
                    subdomains={state.subdomains.data?.subdomains || []}
                    reverseip={state.reverseip.data}
                    ghost={state.ghost.data}
                    tech={state.tech.data}
                  />
                </Loader>
              </motion.div>

              {/* SECONDARY ROW: Three Columns */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* Column 1: Identity */}
                <motion.div variants={itemVariants} className="space-y-6">

                  {/* Google Dorks Link Dump */}
                  <Loader loading={state.dorks.loading}>
                    <GoogleDorks data={state.dorks.data} />
                  </Loader>

                  <Loader loading={state.screenshot.loading}>
                    <ScreenshotTool data={state.screenshot.data || {}} />
                  </Loader>
                  <Loader loading={state.crawler.loading}>
                    <SiteCrawler data={state.crawler.data || {}} />
                  </Loader>
                  <Loader loading={state.ghost.loading}>
                    <GhostTrack data={state.ghost.data || {}} />
                  </Loader>
                  <Loader loading={state.handles.loading}>
                    <HandleHunter
                      data={state.handles.data || {}}
                      detectedLinks={state.tech.data?.social_links || []}
                    />
                  </Loader>
                  <Loader loading={state.email.loading}>
                    <EmailHarvester data={state.email.data || {}} />
                  </Loader>
                  <BreachRadar emails={state.email.data?.emails || []} />
                  <Loader loading={state.whois.loading}>
                    <WhoisInfo data={state.whois.data || {}} />
                  </Loader>
                  <Loader loading={state.history.loading}>
                    <Timeline data={state.history.data || {}} />
                  </Loader>
                  <Loader loading={state.securitytxt.loading}>
                    <SecurityTxt data={state.securitytxt.data || {}} />
                  </Loader>
                  <Loader loading={state.securitytxt_quality.loading}>
                    <SecurityTxtQuality data={state.securitytxt_quality.data || {}} />
                  </Loader>
                  <Loader loading={state.robots_security.loading}>
                    <RobotsSecurity data={state.robots_security.data || {}} />
                  </Loader>
                  <Loader loading={state.dns_security.loading}>
                    <DNSSecurity data={state.dns_security.data || {}} />
                  </Loader>
                  <Loader loading={state.dnssec.loading}>
                    <DNSSECCheck data={state.dnssec.data || {}} />
                  </Loader>
                  <Loader loading={state.spoofing_risk.loading}>
                    <SpoofingRisk data={state.spoofing_risk.data || {}} />
                  </Loader>
                  <Loader loading={state.favicon.loading}>
                    <FaviconHash data={state.favicon.data || {}} />
                  </Loader>
                </motion.div>

                {/* Column 2: Infrastructure */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <Loader loading={state.metadata.loading}>
                    <MetadataStalker data={state.metadata.data || {}} />
                  </Loader>
                  <Loader loading={state.tech.loading}>
                    <SiteMetadata data={state.tech.data || {}} />
                  </Loader>
                  <CveMapper technologies={state.tech.data?.technologies || []} />
                  <CreatorIntel
                    apiBase={apiBase}
                    domain={domain}
                    ghostData={state.ghost.data}
                  />
                  <Loader loading={state.ssl.loading}>
                    <SslInfo data={state.ssl.data || {}} />
                  </Loader>
                  <Loader loading={state.tls.loading}>
                    <TLSScanner data={state.tls.data || {}} />
                  </Loader>
                  <Loader loading={state.tls_ciphers.loading}>
                    <TLSCiphers data={state.tls_ciphers.data || {}} />
                  </Loader>
                  <Loader loading={state.ports.loading}>
                    <PortScanner data={state.ports.data || []} loading={state.ports.loading} />
                  </Loader>
                  <Loader loading={state.robots.loading}>
                    <RobotsAnalysis data={state.robots.data || {}} />
                  </Loader>
                  <Loader loading={state.crtsh.loading}>
                    <CrtshSubdomains data={state.crtsh.data || {}} />
                  </Loader>
                  <Loader loading={state.cloud.loading}>
                    <CloudEnum data={state.cloud.data || {}} />
                  </Loader>
                  <Loader loading={state.reverseip.loading}>
                    <ReverseIP data={state.reverseip.data || {}} />
                  </Loader>
                </motion.div>

                {/* Column 3: Security */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <Loader loading={state.http.loading}>
                    <SecurityGrade data={state.http.data || {}} />
                  </Loader>
                  <Loader loading={state.header_quality.loading}>
                    <HeaderQuality data={state.header_quality.data || {}} />
                  </Loader>
                  <TraceAnalyzer apiBase={apiBase} domain={domain} />
                  <Loader loading={state.waf.loading}>
                    <WAFDetector data={state.waf.data || {}} />
                  </Loader>
                  <Loader loading={state.gitenv.loading}>
                    <GitEnvScanner data={state.gitenv.data || {}} />
                  </Loader>
                  <Loader loading={state.fuzzer.loading}>
                    <DirFuzzer data={state.fuzzer.data || {}} />
                  </Loader>
                  <Loader loading={state.takeover.loading}>
                    <TakeoverCheck data={state.takeover.data || {}} />
                  </Loader>
                  <Loader loading={state.cname_takeover.loading}>
                    <CnameTakeover data={state.cname_takeover.data || {}} />
                  </Loader>
                  <Loader loading={state.cors.loading}>
                    <CORSScanner data={state.cors.data || {}} />
                  </Loader>
                  <Loader loading={state.open_redirect.loading}>
                    <RedirectCheck data={state.open_redirect.data || {}} />
                  </Loader>
                  <Loader loading={state.host_header.loading}>
                    <HostHeaderCheck data={state.host_header.data || {}} />
                  </Loader>
                  <Loader loading={state.api_discovery.loading}>
                    <ApiDiscovery data={state.api_discovery.data || {}} />
                  </Loader>
                  <Loader loading={state.http.loading}>
                    <HttpAnalyzer data={state.http.data || {}} />
                  </Loader>
                  <Loader loading={state.jssecrets.loading}>
                    <JSSecrets data={state.jssecrets.data || {}} />
                  </Loader>
                  <Loader loading={state.internetdb.loading}>
                    <InternetDB data={state.internetdb.data || {}} />
                  </Loader>
                  <Loader loading={state.dnsbl.loading}>
                    <DNSBLCheck data={state.dnsbl.data || {}} />
                  </Loader>
                </motion.div>

              </div>

            </motion.main>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
