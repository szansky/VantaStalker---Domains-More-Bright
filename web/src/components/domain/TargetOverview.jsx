import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Globe, Copy, Check, ExternalLink } from 'lucide-react';

const TargetOverview = ({ data }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        if (data.ip) {
            await navigator.clipboard.writeText(data.ip);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* Domain & IP */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-6 h-6 text-blue-400" />
                        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500 tracking-tight">
                            {data.domain}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900/80 rounded border border-white/10 group hover:border-blue-500/50 transition-colors">
                            <span className="font-mono text-sm text-neutral-400">IP:</span>
                            <span className="font-mono text-sm text-emerald-400">{data.ip}</span>
                            <button
                                onClick={copyToClipboard}
                                className="ml-2 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                                title="Copy IP"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                        </div>
                        {data.asn && <Badge variant="info">{data.asn}</Badge>}
                    </div>
                </div>

                {/* Quick Stats or Actions */}
                <div className="flex gap-3">
                    <a
                        href={`https://${data.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                    >
                        Visit Site <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

            </div>
        </Card>
    );
};

export default TargetOverview;
