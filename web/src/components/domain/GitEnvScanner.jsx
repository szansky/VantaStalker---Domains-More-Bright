import React from 'react';
import Card from '../ui/Card';
import { FileWarning, FolderLock, ShieldCheck, AlertOctagon } from 'lucide-react';
import Badge from '../ui/Badge';

const GitEnvScanner = ({ data }) => {
    if (!data?.scanned) return null;

    const hasExposed = data.exposed && data.exposed.length > 0;

    return (
        <Card title="Sensitive Config Scanner">
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${hasExposed ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                    {hasExposed ? (
                        <AlertOctagon className="w-8 h-8 text-red-500" />
                    ) : (
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    )}
                </div>
                <div>
                    <div className={`text-lg font-bold ${hasExposed ? 'text-red-400' : 'text-emerald-400'}`}>
                        {hasExposed ? 'EXPOSED FILES FOUND' : 'Secure'}
                    </div>
                    <div className="text-xs text-neutral-500">
                        Scanned for .git, .env, docker-compose, and backups.
                    </div>
                </div>
            </div>

            {hasExposed && (
                <div className="space-y-2 animate-pulse">
                    {data.exposed.map((item, idx) => (
                        <div key={idx} className="bg-red-950/40 border border-red-500/50 rounded p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FileWarning className="w-4 h-4 text-red-400" />
                                <div>
                                    <div className="text-sm font-bold text-red-300">{item.name}</div>
                                    <div className="text-[10px] font-mono text-neutral-400">{item.file}</div>
                                </div>
                            </div>
                            <Badge variant="danger">{item.severity}</Badge>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default GitEnvScanner;
