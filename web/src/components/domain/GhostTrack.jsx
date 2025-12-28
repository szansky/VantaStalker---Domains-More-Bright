import React from 'react';
import Card from '../ui/Card';
import { Fingerprint, Scan, Code, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';

const GhostTrack = ({ data }) => {
    // Check if we have any data
    const hasData = data && (
        data.tracking_ids?.length > 0 ||
        data.adsense_ids?.length > 0 ||
        data.social_pixels?.length > 0 ||
        data.verification_codes?.length > 0
    );

    if (!hasData) return null;

    return (
        <Card title="Digital Footprint (Ghost Track)">
            <div className="space-y-6">

                {/* Tracking IDs */}
                {data.tracking_ids?.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Scan className="w-3 h-3 text-blue-400" /> Google Tracking IDs (Analytics/Tag Manager)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {data.tracking_ids.map((id, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-blue-950/20 border border-blue-500/20 rounded">
                                    <span className="font-mono text-blue-300 text-sm">{id}</span>
                                    <a
                                        href={`https://dnslytics.com/search?q=${id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-2 py-1 rounded transition-colors"
                                    >
                                        Reverse Search
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AdSense */}
                {data.adsense_ids?.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Fingerprint className="w-3 h-3 text-amber-400" /> AdSense Publisher IDs
                        </div>
                        <div className="space-y-2">
                            {data.adsense_ids.map((id, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-amber-950/20 border border-amber-500/20 rounded">
                                    <span className="font-mono text-amber-300 text-sm">{id}</span>
                                    <a
                                        href={`https://builtwith.com/relationships/${id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-2 py-1 rounded transition-colors"
                                    >
                                        Find Owner Sites
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pixels */}
                {data.social_pixels?.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Code className="w-3 h-3 text-purple-400" /> Social Pixels
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.social_pixels.map((id, idx) => (
                                <Badge key={idx} variant="default">FB: {id}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Verification Codes */}
                {data.verification_codes?.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-400" /> Domain Verification
                        </div>
                        <div className="space-y-1">
                            {data.verification_codes.map((code, idx) => (
                                <div key={idx} className="text-[10px] font-mono text-neutral-400 truncate bg-neutral-900/50 p-1.5 rounded border border-white/5" title={code}>
                                    {code}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default GhostTrack;
