import React from 'react';
import Card from '../ui/Card';
import { Shield, Server, Box, Hexagon } from 'lucide-react';
import Badge from '../ui/Badge';

const InternetDB = ({ data }) => {
    if (!data || data.error) return null;

    const hasPorts = data.ports && data.ports.length > 0;
    const hasVulns = data.vulns && data.vulns.length > 0;
    const hasTags = data.tags && data.tags.length > 0;

    if (!hasPorts && !hasVulns && !hasTags) return null;

    return (
        <Card title="InternetDB (Shodan Free)">
            <div className="space-y-4">

                {/* Vulnerabilities (Critical) */}
                {hasVulns && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Shield className="w-3 h-3" /> Vulnerabilities (CVE)
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.vulns.map((cve, idx) => (
                                <a
                                    key={idx}
                                    href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-mono bg-red-500/10 text-red-300 px-2 py-1 rounded hover:bg-red-500/20 transition-colors"
                                >
                                    {cve}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ports */}
                {hasPorts && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Server className="w-3 h-3" /> Open Ports
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.ports.map((port, idx) => (
                                <Badge key={idx} variant="outline">{port}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {hasTags && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Hexagon className="w-3 h-3" /> Tags
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.tags.map((tag, idx) => (
                                <Badge key={idx} variant="default">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hostnames */}
                {data.hostnames?.length > 0 && (
                    <div className="text-[10px] text-neutral-500 font-mono break-all bg-neutral-900/50 p-2 rounded">
                        {data.hostnames.join(', ')}
                    </div>
                )}

            </div>
        </Card>
    );
};

export default InternetDB;
