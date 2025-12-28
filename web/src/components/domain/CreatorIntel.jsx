import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { User, MessageSquare, Fingerprint, Search } from 'lucide-react';

const CreatorIntel = ({ apiBase, domain, ghostData }) => {
    const [loading, setLoading] = useState(false);
    const [commentsData, setCommentsData] = useState(null);

    useEffect(() => {
        if (domain && !commentsData) {
            fetchComments();
        }
    }, [domain]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: domain })
            });
            const json = await res.json();
            setCommentsData(json);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const reverseLinks = ghostData?.reverse_links || [];

    return (
        <Card title="Creator Intelligence">
            <div className="space-y-6">

                {/* 1. Reverse Identity (Ghost Track) */}
                {reverseLinks.length > 0 ? (
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                            <Fingerprint className="w-3 h-3" />
                            Reverse Analytics (Attribution)
                        </h4>
                        <div className="grid gap-2">
                            {reverseLinks.map((item, i) => (
                                <div key={i} className="bg-purple-900/10 border border-purple-500/20 p-2 rounded text-xs">
                                    <div className="font-mono text-purple-200 mb-1">{item.id}</div>
                                    <div className="flex gap-2">
                                        <a href={item.builtwith} target="_blank" rel="noreferrer" className="flex-1 bg-black/30 hover:bg-black/50 text-center py-1 rounded text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-1">
                                            <Search className="w-3 h-3" /> BuiltWith
                                        </a>
                                        <a href={item.dnslytics} target="_blank" rel="noreferrer" className="flex-1 bg-black/30 hover:bg-black/50 text-center py-1 rounded text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-1">
                                            <Search className="w-3 h-3" /> DNSLytics
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-neutral-500 italic">No tracking IDs found for reverse analytics.</div>
                )}

                {/* 2. Developer Comments */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Developer Comments
                    </h4>

                    {loading && <div className="text-xs text-neutral-500 animate-pulse">Scanning HTML/JS...</div>}

                    {!loading && commentsData?.comments?.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                            {commentsData.comments.map((c, i) => (
                                <div key={i} className="bg-neutral-900 p-2 rounded border border-white/5 text-[10px] font-mono text-neutral-400 break-words">
                                    {c}
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <div className="text-xs text-neutral-500">No interesting comments found.</div>
                    )}

                    {/* Potential Users from Comments */}
                    {commentsData?.potential_users?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {commentsData.potential_users.map((u, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs bg-blue-900/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                                    <User className="w-3 h-3" />
                                    @{u}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Card>
    );
};

export default CreatorIntel;
