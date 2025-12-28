import React from 'react';
import Card from '../ui/Card';
import { Globe, Shield, Clock } from 'lucide-react';

const CrtshSubdomains = ({ data }) => {
    if (!data?.subdomains || data.subdomains.length === 0) return null;

    return (
        <Card title={`CT Subdomains (${data.count})`}>
            <div className="text-xs text-neutral-400 mb-3">
                Subdomains from Certificate Transparency logs
            </div>

            <div className="max-h-48 overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-1">
                {data.subdomains.slice(0, 50).map((sub, idx) => (
                    <a
                        key={idx}
                        href={`https://${sub}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-blue-400 hover:text-blue-300 bg-neutral-900/50 p-1.5 rounded truncate border border-transparent hover:border-blue-500/30 transition-colors"
                    >
                        {sub}
                    </a>
                ))}
            </div>

            {/* Certificates Info */}
            {data.certificates?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase font-bold mb-2">Recent Certificates</div>
                    <div className="space-y-1">
                        {data.certificates.slice(0, 3).map((cert, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[9px] text-neutral-400">
                                <Shield className="w-2.5 h-2.5 text-emerald-500" />
                                <span className="truncate">{cert.issuer?.split(',')[0] || 'Unknown'}</span>
                                <span className="text-neutral-600">|</span>
                                <Clock className="w-2.5 h-2.5" />
                                <span>{cert.not_before?.split('T')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default CrtshSubdomains;
