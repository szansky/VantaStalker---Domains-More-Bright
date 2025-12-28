import React, { useState } from 'react';
import Card from '../ui/Card';
import { Bomb, AlertTriangle, Terminal } from 'lucide-react';

const TraceAnalyzer = ({ apiBase, domain }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const handleProvoke = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/trace`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: domain })
            });
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <Card title="System Trace Trigger">
            <div className="space-y-4">
                <div className="text-xs text-neutral-400">
                    Attempts to provoke server errors (Status 500) to leak internal file paths and usernames.
                </div>

                {!data && (
                    <button
                        onClick={handleProvoke}
                        disabled={loading || !domain}
                        className="w-full py-2 bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 text-red-300 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Provoking System...' : (
                            <>
                                <Bomb className="w-4 h-4" />
                                Provoke Errors
                            </>
                        )}
                    </button>
                )}

                {data && (
                    <div className="space-y-3 animate-in slide-in-from-top-2">
                        <div className={`text-xs font-bold px-2 py-1 rounded border inline-block ${data.status.includes('Leaked') ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}>
                            {data.status}
                        </div>

                        {data.paths_found?.length > 0 && (
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-neutral-500 uppercase">Leaked Paths</h4>
                                <div className="bg-black/50 p-2 rounded border border-white/5 font-mono text-[10px] text-neutral-300 overflow-x-auto">
                                    {data.paths_found.map((p, i) => (
                                        <div key={i}>{p}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.usernames_found?.length > 0 && (
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-red-400 uppercase flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" />
                                    Leaked Usernames
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.usernames_found.map((u, i) => (
                                        <span key={i} className="text-xs bg-red-900/30 text-red-200 px-2 py-0.5 rounded border border-red-500/30">
                                            {u}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TraceAnalyzer;
