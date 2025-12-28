import React from 'react';
import Card from '../ui/Card';
import { Loader2, Globe } from 'lucide-react';

const SubdomainList = ({ data, loading }) => {
    return (
        <Card title="Subdomains Found">
            {loading && (!data || data.length === 0) ? (
                <div className="flex items-center justify-center p-6 text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Harvesting subdomains...</span>
                </div>
            ) : (
                <div className="bg-neutral-900/30 rounded-lg border border-white/5 max-h-80 overflow-y-auto custom-scrollbar p-1">
                    {data && data.length > 0 ? (
                        data.map((sub, idx) => (
                            <a
                                key={idx}
                                href={`https://${sub}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                            >
                                <Globe className="w-4 h-4 text-neutral-600 group-hover:text-blue-400 transition-colors" />
                                <span className="text-sm font-mono text-neutral-300 group-hover:text-blue-200 transition-colors truncate">
                                    {sub}
                                </span>
                            </a>
                        ))
                    ) : (
                        <div className="p-4 text-center text-sm text-neutral-500 italic">
                            No subdomains found.
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default SubdomainList;
