import React from 'react';
import Card from '../ui/Card';
import { AtSign, ExternalLink, Link as LinkIcon, CheckCircle } from 'lucide-react';

const HandleHunter = ({ data, detectedLinks }) => {
    const hasDetected = detectedLinks && detectedLinks.length > 0;
    const hasScouted = data?.found_profiles && data.found_profiles.length > 0;

    if (!hasDetected && !hasScouted) return null;

    return (
        <Card title="Social Identity">
            <div className="space-y-4">

                {/* 1. Verified Links (Found on Page) - PRIORITY */}
                {hasDetected && (
                    <div>
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> Found on Site
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {detectedLinks.map((link, idx) => {
                                let displayName = link;
                                try { displayName = new URL(link).hostname.replace('www.', ''); } catch (e) { }

                                return (
                                    <a
                                        key={idx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2 px-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg hover:border-emerald-500/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <LinkIcon className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm text-emerald-100 truncate">{link}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-emerald-600 group-hover:text-emerald-400 flex-shrink-0" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 2. Username Scout (Supplementary) */}
                {hasScouted && (
                    <div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AtSign className="w-3 h-3" /> Potential Handles (@{data.keyword})
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {data.found_profiles.map((profile, idx) => (
                                <a
                                    key={idx}
                                    href={profile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-neutral-900/50 border border-white/5 rounded hover:border-blue-500/30 transition-colors text-xs text-neutral-400 hover:text-blue-300"
                                >
                                    <span>{profile.platform}</span>
                                    <ExternalLink className="w-2.5 h-2.5 ml-auto opacity-50" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default HandleHunter;
