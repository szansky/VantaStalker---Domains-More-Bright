import React from 'react';
import Card from '../ui/Card';
import { FolderSearch, AlertOctagon, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';

const DirFuzzer = ({ data }) => {
    if (!data?.found) return null;

    const hits = data.found;
    const hasHits = hits.length > 0;

    return (
        <Card title="Directory Fuzzing">
            <div className="flex items-center gap-3 mb-3">
                <FolderSearch className={`w-5 h-5 ${hasHits ? 'text-blue-400' : 'text-neutral-500'}`} />
                <div className="text-sm text-neutral-400">
                    Checking common paths...
                    {hasHits ? (
                        <span className="text-white font-bold ml-1">{hits.length} FOUND</span>
                    ) : (
                        <span className="text-neutral-600 ml-1">Nothing public</span>
                    )}
                </div>
            </div>

            {hasHits && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                    {hits.map((hit, idx) => (
                        <a
                            key={idx}
                            href={hit.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2 rounded bg-neutral-900/50 hover:bg-neutral-800 transition-colors group"
                        >
                            <span className="text-xs font-mono text-blue-300 group-hover:text-blue-200">/{hit.path}</span>
                            <Badge variant={hit.status === 200 ? 'success' : (hit.status === 403 ? 'warning' : 'default')}>
                                {hit.status}
                            </Badge>
                        </a>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default DirFuzzer;
