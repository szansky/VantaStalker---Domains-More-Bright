import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const DnsSection = ({ data }) => {
    return (
        <Card title="DNS Configuration">
            <div className="space-y-6">

                {/* A Records */}
                {data.a && data.a.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 pl-1 border-l-2 border-blue-500">A Records</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {data.a.map((record, idx) => (
                                <div key={idx} className="bg-neutral-900/50 p-3 rounded border border-white/5 font-mono text-sm text-neutral-300 hover:border-blue-500/30 transition-colors">
                                    {record}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MX Records */}
                {data.mx && data.mx.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 pl-1 border-l-2 border-purple-500">MX Records (Mail)</div>
                        <div className="space-y-2">
                            {data.mx.map((record, idx) => (
                                <div key={idx} className="bg-neutral-900/50 p-3 rounded border border-white/5 flex justify-between items-center text-sm group hover:bg-white/5 transition-colors">
                                    <span className="font-mono text-neutral-300">{record.exchange}</span>
                                    <Badge variant="default">Pri: {record.preference}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TXT Records */}
                {data.txt && data.txt.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 pl-1 border-l-2 border-amber-500">TXT Records</div>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {data.txt.map((record, idx) => (
                                <div key={idx} className="bg-neutral-900/50 p-3 rounded border border-white/5 text-xs font-mono text-neutral-400 break-all leading-relaxed hover:text-neutral-200 transition-colors">
                                    {record}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Nameservers */}
                {data.ns && data.ns.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 pl-1 border-l-2 border-emerald-500">Nameservers</div>
                        <div className="flex flex-wrap gap-2">
                            {data.ns.map((ns, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-neutral-900 border border-white/10 rounded text-xs font-mono text-emerald-400/80">
                                    {ns}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default DnsSection;
