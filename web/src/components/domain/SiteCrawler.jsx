import React from 'react';
import Card from '../ui/Card';
import { Network, ExternalLink } from 'lucide-react';

const SiteCrawler = ({ data }) => {
    if (!data?.internal) return null;

    return (
        <Card title={`Site Map (${data.total_links} Links)`}>
            <div className="space-y-4">

                {/* Internal Structure */}
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                        <Network className="w-3 h-3" /> Internal Routes
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                        {data.internal.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono px-2 py-1 bg-neutral-900 border border-white/5 rounded text-neutral-300 hover:text-white hover:border-blue-500/50 transition-colors truncate max-w-[200px]"
                                title={link.url}
                            >
                                {link.path}
                            </a>
                        ))}
                    </div>
                </div>

                {/* External Links */}
                {data.external.length > 0 && (
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" /> External Connections
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.external.map((domain, idx) => (
                                <div key={idx} className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-1 rounded">
                                    {domain}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default SiteCrawler;
