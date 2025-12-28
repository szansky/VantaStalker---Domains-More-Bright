import React from 'react';
import Card from '../ui/Card';
import { Server, Monitor, Shield } from 'lucide-react';

const HttpAnalyzer = ({ data }) => {
    if (!data) return null;

    return (
        <Card title="HTTP Server Analysis">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                <div className="p-4 bg-neutral-900/50 rounded-lg border border-white/5 shadow-inner">
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> Status
                    </div>
                    <div className={`text-xl font-mono ${data.status_code >= 400 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {data.status_code}
                    </div>
                </div>

                <div className="p-4 bg-neutral-900/50 rounded-lg border border-white/5 shadow-inner">
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                        <Server className="w-3 h-3" /> Server
                    </div>
                    <div className="text-lg font-medium text-neutral-200 truncate" title={data.server}>
                        {data.server || 'Unknown'}
                    </div>
                </div>

                <div className="p-4 bg-neutral-900/50 rounded-lg border border-white/5 shadow-inner">
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Technology
                    </div>
                    <div className="text-lg font-medium text-neutral-200 truncate" title={data.x_powered_by}>
                        {data.x_powered_by || 'Unknown'}
                    </div>
                </div>

            </div>

            <div className="border-t border-white/5 pt-4">
                <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-400 hover:text-blue-400 transition-colors select-none">
                        View All Headers
                    </summary>
                    <div className="mt-4 bg-black/40 text-neutral-300 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed shadow-inner border border-white/5 max-h-60 custom-scrollbar">
                        {Object.entries(data.headers || {}).map(([key, val]) => (
                            <div key={key} className="flex gap-2">
                                <span className="text-blue-400 font-semibold min-w-max">{key}:</span>
                                <span className="text-neutral-200 break-all">{val}</span>
                            </div>
                        ))}
                    </div>
                </details>
            </div>
        </Card>
    );
};

export default HttpAnalyzer;
