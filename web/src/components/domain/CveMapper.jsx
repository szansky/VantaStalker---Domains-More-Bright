import React, { useState } from 'react';
import Card from '../ui/Card';
import { Bug, Search, ExternalLink } from 'lucide-react';

const CveMapper = ({ technologies = [] }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleHunt = async () => {
        if (!technologies.length) return;
        setLoading(true);
        try {
            const cleanTechs = technologies.map(t => t.split(' (v')[0]); // Clean version somewhat for logic if needed, but backend handles it

            const res = await fetch('http://localhost:8000/api/cve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ technologies: technologies })
            });
            const data = await res.json();
            setResults(data.cve_links);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (!technologies.length) return null; // Don't show if no tech found

    return (
        <Card title="Vulnerability Mapper">
            <div className="space-y-4">
                <div className="text-xs text-neutral-400">
                    Detected {technologies.length} technologies. Check for known vulnerabilities (CVEs).
                </div>

                <div className="flex flex-wrap gap-2">
                    {technologies.map((t, i) => (
                        <span key={i} className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-300 border border-white/5">
                            {t}
                        </span>
                    ))}
                </div>

                {!results && (
                    <button
                        onClick={handleHunt}
                        disabled={loading}
                        className="w-full py-2 bg-red-900/30 border border-red-500/50 hover:bg-red-900/50 text-red-200 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Analyzing...' : (
                            <>
                                <Bug className="w-4 h-4" />
                                Hunt for CVEs
                            </>
                        )}
                    </button>
                )}

                {results && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                        {results.map((item, idx) => (
                            <div key={idx} className="bg-neutral-900 p-3 rounded border border-white/5 flex flex-col gap-2">
                                <div className="font-bold text-sm text-neutral-300">{item.technology}</div>
                                <div className="flex gap-2">
                                    <a href={item.google_link} target="_blank" rel="noreferrer" className="flex-1 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/30 text-blue-300 text-xs p-2 rounded text-center flex items-center justify-center gap-2">
                                        <Search className="w-3 h-3" />
                                        Google Dorks
                                    </a>
                                    <a href={item.nvd_link} target="_blank" rel="noreferrer" className="flex-1 bg-orange-900/20 hover:bg-orange-900/40 border border-orange-500/30 text-orange-300 text-xs p-2 rounded text-center flex items-center justify-center gap-2">
                                        <ExternalLink className="w-3 h-3" />
                                        NIST NVD
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CveMapper;
