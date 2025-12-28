import React from 'react';
import Card from '../ui/Card';
import { Shield, FileText, FolderOpen, AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';

const RobotsAnalysis = ({ data }) => {
    const hasRobots = data?.robots?.found;
    const hasSitemap = data?.sitemap?.found;
    const hasInteresting = data?.interesting_paths?.length > 0;

    if (!hasRobots && !hasSitemap) return null;

    return (
        <Card title="Robots & Sitemap Analysis">
            <div className="space-y-4">

                {/* Interesting Paths (Priority) */}
                {hasInteresting && (
                    <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Interesting Paths
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.interesting_paths.map((path, idx) => (
                                <Badge key={idx} variant="warning">{path}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Robots.txt */}
                {hasRobots && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Shield className="w-3 h-3" /> Disallowed Paths ({data.robots.disallowed.length})
                        </div>
                        <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto custom-scrollbar">
                            {data.robots.disallowed.slice(0, 20).map((path, idx) => (
                                <div key={idx} className="text-[10px] font-mono text-neutral-400 bg-neutral-900/50 p-1 rounded truncate">
                                    {path}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sitemap */}
                {hasSitemap && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <FolderOpen className="w-3 h-3" /> Sitemap URLs ({data.sitemap.count})
                        </div>
                        <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
                            {data.sitemap.urls.slice(0, 10).map((url, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-[10px] font-mono text-blue-400 hover:text-blue-300 truncate"
                                >
                                    {url}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default RobotsAnalysis;
