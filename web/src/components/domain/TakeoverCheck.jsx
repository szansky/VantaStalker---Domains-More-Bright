import React from 'react';
import Card from '../ui/Card';
import { AlertTriangle, Globe, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';

const TakeoverCheck = ({ data }) => {
    if (!data?.checked || data.checked.length === 0) return null;

    const hasVuln = data.vulnerable && data.vulnerable.length > 0;

    return (
        <Card title="Subdomain Takeover">
            <div className="space-y-4">

                {/* Vulnerable Findings */}
                {hasVuln && (
                    <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Dangling CNAMEs Found!
                        </div>
                        <div className="space-y-2">
                            {data.vulnerable.map((vuln, idx) => (
                                <div key={idx} className="bg-black/40 p-2 rounded">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-mono text-white">{vuln.host}</span>
                                        <Badge variant="danger">{vuln.service}</Badge>
                                    </div>
                                    <div className="text-[10px] text-neutral-500 mt-1">
                                        Points to: <span className="text-neutral-400">{vuln.cname}</span>
                                    </div>
                                    <div className="text-[10px] text-red-400 mt-1 font-bold">
                                        {vuln.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status if Clean */}
                {!hasVuln && (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/10 p-2 rounded border border-emerald-500/10">
                        <CheckCircle className="w-4 h-4" />
                        <div className="text-xs font-bold">No dangling records found.</div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default TakeoverCheck;
