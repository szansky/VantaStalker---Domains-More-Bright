import React from 'react';
import Card from '../ui/Card';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';

const DNSBLCheck = ({ data }) => {
    if (!data || data.error) return null;

    const isClean = !data.listed;

    return (
        <Card title="Blacklist Check (DNSBL)">
            <div className="flex items-center gap-4">

                {/* Status Icon */}
                <div className={`p-3 rounded-full ${isClean ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {isClean ? (
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    ) : (
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className={`text-lg font-bold ${isClean ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isClean ? 'Clean' : 'LISTED'}
                    </div>
                    <div className="text-xs text-neutral-500">
                        {data.clean_lists} / {data.total_checked} lists checked
                    </div>
                </div>

            </div>

            {/* Blacklists Found */}
            {data.blacklists?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Listed On:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.blacklists.map((bl, idx) => (
                            <Badge key={idx} variant="danger">{bl}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default DNSBLCheck;
