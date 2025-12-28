import React from 'react';
import Card from '../ui/Card';
import { AlertTriangle, GitBranch } from 'lucide-react';

const EndpointMap = ({ data = { discovered_endpoints: [], potential_secrets: [] } }) => {
    return (
        <Card title="API & Endpoint Discovery">
            {(!data.discovered_endpoints?.length && !data.potential_secrets?.length) ? (
                <div className="p-6 text-center text-neutral-500 text-sm italic">
                    No exposed endpoints or secrets detected in HTML source.
                </div>
            ) : (
                <>
                    {/* Secrets Warning */}
                    {data.potential_secrets?.length > 0 && (
                        <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Secrets Exposed</h4>
                                </div>
                                <ul className="space-y-2">
                                    {data.potential_secrets.map((secret, idx) => (
                                        <li key={idx} className="flex items-center justify-between text-xs text-red-200/90 font-mono bg-red-900/20 px-3 py-2 rounded">
                                            <span>{secret}</span>
                                            <span className="px-2 py-0.5 bg-red-500/20 rounded text-[10px] font-bold text-red-300">CRITICAL</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Endpoint Tree */}
                    {data.discovered_endpoints?.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <GitBranch className="w-4 h-4 text-indigo-400" />
                                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Discovered Routes ({data.discovered_endpoints.length})</h4>
                            </div>

                            <div className="bg-neutral-900/50 rounded-lg border border-white/5 p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {data.discovered_endpoints.map((ep, index) => (
                                    <div key={index} className="group flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded transition-colors text-sm font-mono text-neutral-400 hover:text-indigo-300">
                                        <span className="text-neutral-600 group-hover:text-indigo-500/50">├──</span>
                                        <span className="truncate">{ep}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </Card>
    );
};

export default EndpointMap;
