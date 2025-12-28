import React from 'react';
import Card from '../ui/Card';
import { ExternalLink, AlertCircle, Maximize2 } from 'lucide-react';

const SitePreview = ({ domain }) => {
    if (!domain) return null;

    // Ensure protocol
    const url = domain.startsWith('http') ? domain : `https://${domain}`;

    return (
        <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 backdrop-blur-md shadow-2xl h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 mx-4">
                    <div className="bg-neutral-800/50 rounded text-center text-[10px] text-neutral-400 py-1 font-mono truncate">
                        {url}
                    </div>
                </div>
            </div>

            <div className="relative flex-1 bg-neutral-950 w-full min-h-[300px] group">

                {/* Placeholder/Loading State behind iframe */}
                <div className="absolute inset-0 flex items-center justify-center text-neutral-700">
                    <span className="text-sm animate-pulse">Establishing Visual Uplink...</span>
                </div>

                <iframe
                    src={url}
                    title={`Preview of ${domain}`}
                    className="relative w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

                <div className="absolute bottom-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                    >
                        Live Site <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SitePreview;
