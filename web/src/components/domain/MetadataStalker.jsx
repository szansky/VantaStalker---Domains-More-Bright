import React from 'react';
import Card from '../ui/Card';
import { FileText, User, Briefcase, File } from 'lucide-react';

const MetadataStalker = ({ data }) => {
    const hasFiles = data?.files_found?.length > 0;

    if (!hasFiles && (!data?.metadata_extracted || data.metadata_extracted.length === 0)) return null;

    return (
        <Card title="Metadata Stalker (Documents)">
            <div className="space-y-6">

                {/* Extracted Metadata */}
                {data.metadata_extracted?.length > 0 && (
                    <div className="space-y-4">
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                            Leaked Metadata Found
                        </div>
                        {data.metadata_extracted.map((item, idx) => (
                            <div key={idx} className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-medium text-xs truncate">
                                    <File className="w-3 h-3" /> {item.file}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(item.meta).map(([key, val]) => (
                                        <div key={key} className="bg-black/30 p-1.5 rounded text-xs">
                                            <span className="text-neutral-500 block text-[9px] uppercase">{key}</span>
                                            <span className="text-white font-mono">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Files Found List */}
                {data.files_found?.length > 0 && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
                            Public Documents ({data.files_found.length})
                        </div>
                        <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                            {data.files_found.map((url, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-xs font-mono text-neutral-400 hover:text-blue-400 truncate p-1 hover:bg-white/5 rounded transition-colors"
                                >
                                    {url.split('/').pop()}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default MetadataStalker;
