import React from 'react';
import Card from '../ui/Card';
import { Server, ExternalLink } from 'lucide-react';

const ReverseIP = ({ data }) => {
    if (!data?.domains || data.domains.length === 0) return null;

    return (
        <Card title={`Reverse IP (${data.count} sites)`}>
            <div className="text-xs text-neutral-400 mb-3">
                Other domains hosted on the same server
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                {data.domains.map((domain, idx) => (
                    <a
                        key={idx}
                        href={`https://${domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 bg-neutral-900/50 border border-white/5 rounded hover:border-blue-500/30 transition-colors text-xs"
                    >
                        <span className="text-neutral-300 font-mono truncate">{domain}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-600 flex-shrink-0 ml-2" />
                    </a>
                ))}
            </div>
        </Card>
    );
};

export default ReverseIP;
