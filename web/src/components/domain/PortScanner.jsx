import React from 'react';
import Card from '../ui/Card';
import { Loader2 } from 'lucide-react';

const PortScanner = ({ data, loading }) => {
    return (
        <Card title="Open Ports">
            {loading && (!data || data.length === 0) ? (
                <div className="flex items-center justify-center p-8 text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Scanning ports...</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {data && data.length > 0 ? (
                        data.map((port) => (
                            <div key={port} className="flex flex-col items-center justify-center p-3 bg-neutral-900 border border-white/10 rounded hover:border-emerald-500/50 transition-colors">
                                <span className="text-lg font-bold text-emerald-400 font-mono">{port}</span>
                                <span className="text-[10px] text-neutral-500 uppercase">Open</span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-sm text-neutral-500 italic p-4">
                            No common open ports found or scan timed out.
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default PortScanner;
