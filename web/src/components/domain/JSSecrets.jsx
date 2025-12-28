import React from 'react';
import Card from '../ui/Card';
import { AlertTriangle, Key, Globe, Code } from 'lucide-react';
import Badge from '../ui/Badge';

const JSSecrets = ({ data }) => {
    const hasSecrets = data?.secrets_found?.length > 0;
    const hasInternalUrls = data?.internal_urls?.length > 0;
    const hasApiEndpoints = data?.api_endpoints?.length > 0;

    if (!hasSecrets && !hasInternalUrls && !hasApiEndpoints) return null;

    return (
        <Card title={`JS Deep Scan (${data.js_files_scanned} files)`}>
            <div className="space-y-4">

                {/* Secrets Found (Critical) */}
                {hasSecrets && (
                    <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Key className="w-3 h-3" /> Exposed Secrets
                        </div>
                        <div className="space-y-2">
                            {data.secrets_found.map((secret, idx) => (
                                <div key={idx} className="bg-black/40 p-2 rounded">
                                    <Badge variant="danger">{secret.type}</Badge>
                                    <div className="text-[10px] font-mono text-red-300 mt-1 truncate">
                                        {secret.preview}
                                    </div>
                                    <div className="text-[9px] text-neutral-500 mt-0.5">
                                        Found in: {secret.file}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Internal URLs */}
                {hasInternalUrls && (
                    <div>
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Internal/Dev URLs
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                            {data.internal_urls.map((url, idx) => (
                                <div key={idx} className="text-[10px] font-mono text-amber-300 bg-amber-950/20 p-1 rounded truncate">
                                    {url}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* API Endpoints */}
                {hasApiEndpoints && (
                    <div>
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Code className="w-3 h-3" /> API Endpoints
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {data.api_endpoints.map((ep, idx) => (
                                <span key={idx} className="text-[10px] font-mono text-blue-300 bg-blue-950/30 px-2 py-0.5 rounded">
                                    {ep}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default JSSecrets;
