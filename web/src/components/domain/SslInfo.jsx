import React from 'react';
import Card from '../ui/Card';
import { Lock, Shield, Calendar, Server } from 'lucide-react';

const SslInfo = ({ data }) => {
    if (!data) return null;

    return (
        <Card title="SSL/TLS Certificate">
            {data.valid ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-neutral-400">
                        <div className="bg-neutral-900/50 p-3 rounded border border-white/5">
                            <div className="text-[10px] uppercase text-neutral-500 font-bold mb-1">Common Name</div>
                            <div className="text-neutral-200 truncate" title={data.subject?.commonName}>{data.subject?.commonName || 'N/A'}</div>
                        </div>
                        <div className="bg-neutral-900/50 p-3 rounded border border-white/5">
                            <div className="text-[10px] uppercase text-neutral-500 font-bold mb-1">Issuer</div>
                            <div className="text-neutral-200 truncate" title={data.issuer?.organizationName}>{data.issuer?.organizationName || 'N/A'}</div>
                        </div>

                        <div className="bg-neutral-900/50 p-3 rounded border border-white/5">
                            <div className="text-[10px] uppercase text-neutral-500 font-bold mb-1">Valid Until</div>
                            <div className={data.days_to_expiry < 30 ? 'text-red-400' : 'text-emerald-400'}>
                                {data.notAfter}
                                {data.days_to_expiry && <span className="text-xs opacity-75 ml-2">({data.days_to_expiry} days left)</span>}
                            </div>
                        </div>
                        <div className="bg-neutral-900/50 p-3 rounded border border-white/5">
                            <div className="text-[10px] uppercase text-neutral-500 font-bold mb-1">Cipher Suite</div>
                            <div className="text-blue-400 text-xs">{data.tls_version} / {data.cipher_name}</div>
                        </div>
                    </div>

                    {/* SANs */}
                    {data.subjectAltName && data.subjectAltName.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <details className="group">
                                <summary className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-400 hover:text-blue-400 transition-colors mt-2 select-none">
                                    <span>View SANs ({data.subjectAltName.length})</span>
                                </summary>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-4 border-l border-white/10 max-h-32 overflow-y-auto custom-scrollbar">
                                    {data.subjectAltName.map((san, idx) => (
                                        <div key={idx} className="text-xs font-mono text-neutral-500">{san}</div>
                                    ))}
                                </div>
                            </details>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-red-400 font-bold p-4 bg-red-900/10 border border-red-900/20 rounded flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    SSL Certificate Invalid or Not Found: {data.error}
                </div>
            )}
        </Card>
    );
};

export default SslInfo;
