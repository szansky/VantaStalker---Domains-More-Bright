import React from 'react';
import Card from '../ui/Card';
import { Mail, Link } from 'lucide-react';
import Badge from '../ui/Badge';

const EmailHarvester = ({ data }) => {
    if (!data?.emails || data.emails.length === 0) return null;

    return (
        <Card title={`Email Harvester (${data.emails.length})`}>
            <div className="space-y-4">

                {/* Emails List */}
                <div className="flex flex-wrap gap-2">
                    {data.emails.map((email, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-900/50 border border-white/5 rounded-lg group hover:border-blue-500/30 transition-colors">
                            <Mail className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                            <span className="text-sm font-mono text-neutral-300 select-all">{email}</span>
                        </div>
                    ))}
                </div>

                {/* Sources Info */}
                {data.sources?.length > 0 && (
                    <div className="text-[10px] text-neutral-500 pt-2 border-t border-white/5">
                        <div className="uppercase font-bold mb-1">Sources Scanned:</div>
                        <div className="space-y-0.5">
                            {data.sources.slice(0, 3).map((src, idx) => (
                                <div key={idx} className="truncate">{src}</div>
                            ))}
                            {data.sources.length > 3 && <div>...and {data.sources.length - 3} more</div>}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default EmailHarvester;
