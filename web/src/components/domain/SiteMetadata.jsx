import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const SiteMetadata = ({ data }) => {
    return (
        <Card title="Tech Stack & Metadata">
            <div className="space-y-6">

                {/* Tech Stack */}
                <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Technologies Detected</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.technologies && data.technologies.length > 0 ? (
                            data.technologies.map((tech, idx) => (
                                <Badge key={idx} variant="info">{tech}</Badge>
                            ))
                        ) : (
                            <span className="text-sm text-neutral-500 italic">No technologies detected</span>
                        )}
                    </div>
                </div>

                {/* Social Links (Found on Page) */}
                {(data.social_links && data.social_links.length > 0) && (
                    <div>
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Social Footprint</h4>
                        <div className="flex flex-wrap gap-2">
                            {data.social_links.map((link, idx) => {
                                let hostname = link;
                                try { hostname = new URL(link).hostname.replace('www.', ''); } catch (e) { }

                                return (
                                    <a
                                        key={idx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-3 py-1 bg-black/40 border border-white/10 rounded-full text-xs text-neutral-300 hover:text-white hover:border-blue-500/50 transition-colors truncate max-w-full"
                                    >
                                        {hostname}
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Meta Info */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                    {data.title && (
                        <div>
                            <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Page Title</div>
                            <div className="text-sm text-neutral-200 font-medium line-clamp-1">{data.title}</div>
                        </div>
                    )}
                    {data.description && (
                        <div>
                            <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Description</div>
                            <div className="text-sm text-neutral-400 leading-relaxed line-clamp-2">{data.description}</div>
                        </div>
                    )}
                </div>

            </div>
        </Card>
    );
};

export default SiteMetadata;
