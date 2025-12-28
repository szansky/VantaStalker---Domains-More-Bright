import React from 'react';
import Card from '../ui/Card';
import { ExternalLink } from 'lucide-react';

const Timeline = ({ data = { first_seen: null, last_seen: null, total_snapshots: 0, wayback_url: '#' } }) => {
    const formatDate = (iso) => {
        if (!iso) return 'N/A';
        return new Date(iso).getFullYear();
    };

    return (
        <Card title="Historical Timeline">
            {!data.first_seen ? (
                <div className="p-6 text-center text-neutral-500 text-sm italic">
                    No historical data available.
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-center p-3 bg-neutral-900/50 rounded border border-white/5 w-1/3">
                            <div className="text-[10px] text-neutral-500 uppercase font-bold">First Seen</div>
                            <div className="text-emerald-400 font-mono">{formatDate(data.first_seen)}</div>
                        </div>

                        <div className="h-px bg-white/10 flex-1 mx-4 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-2 text-[10px] text-neutral-500 whitespace-nowrap">
                                {data.total_snapshots} snapshots
                            </div>
                        </div>

                        <div className="text-center p-3 bg-neutral-900/50 rounded border border-white/5 w-1/3">
                            <div className="text-[10px] text-neutral-500 uppercase font-bold">Last Seen</div>
                            <div className="text-blue-400 font-mono">{formatDate(data.last_seen)}</div>
                        </div>
                    </div>

                    <div className="text-center">
                        <a
                            href={data.wayback_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded transition-colors"
                        >
                            View on Wayback Machine
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default Timeline;
