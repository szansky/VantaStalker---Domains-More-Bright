import React from 'react';
import Card from '../ui/Card';
import { Cloud, Lock, Unlock, ExternalLink } from 'lucide-react';
import Badge from '../ui/Badge';

const CloudEnum = ({ data }) => {
    if (!data?.open_buckets || data.open_buckets.length === 0) return null;

    return (
        <Card title="Cloud Storage Buckets">
            <div className="space-y-3">
                {data.open_buckets.map((bucket, idx) => (
                    <div key={idx} className={`p-2 rounded border ${bucket.status.includes('OPEN') ? 'bg-red-950/20 border-red-500/30' : 'bg-neutral-900/50 border-white/5'}`}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Cloud className="w-4 h-4 text-neutral-400" />
                                {bucket.status.includes('OPEN') ? (
                                    <Unlock className="w-3 h-3 text-red-400" />
                                ) : (
                                    <Lock className="w-3 h-3 text-emerald-400" />
                                )}
                                <span className={`text-xs font-bold ${bucket.status.includes('OPEN') ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {bucket.status}
                                </span>
                            </div>
                            <Badge variant={bucket.status.includes('OPEN') ? 'danger' : 'default'}>AWS S3</Badge>
                        </div>

                        <a
                            href={bucket.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-neutral-400 hover:text-blue-400 truncate block mt-1 flex items-center gap-1"
                        >
                            {bucket.url} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default CloudEnum;
