import React, { useState } from 'react';
import Card from '../ui/Card';
import { Skull, ExternalLink } from 'lucide-react';

const BreachRadar = ({ emails = [] }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleCheck = async () => {
        if (!emails.length) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/breach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: emails })
            });
            const data = await res.json();
            setResults(data.breach_links);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (!emails.length) return null;

    return (
        <Card title="Breach Radar">
            <div className="space-y-4">
                <div className="text-xs text-neutral-400">
                    Harvested {emails.length} emails. Check if they appear in known data leaks.
                </div>

                {!results && (
                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="w-full py-2 bg-purple-900/30 border border-purple-500/50 hover:bg-purple-900/50 text-purple-200 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Scanning...' : (
                            <>
                                <Skull className="w-4 h-4" />
                                Check Leaks
                            </>
                        )}
                    </button>
                )}

                {results && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {results.map((item, idx) => (
                            <div key={idx} className="bg-neutral-900 p-2 rounded border border-white/5 flex items-center justify-between text-xs">
                                <span className="text-neutral-300 truncate max-w-[150px]">{item.email}</span>
                                <div className="flex gap-1">
                                    <a href={item.dehashed_url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline">DeHashed</a>
                                    <span className="text-neutral-600">|</span>
                                    <a href={item.intelx_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline">IntelX</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default BreachRadar;
