import React from 'react';
import Card from '../ui/Card';
import { Lock, Unlock } from 'lucide-react';

const CORSScanner = ({ data }) => {
    if (data?.vulnerable === undefined) return null;

    return (
        <Card title="API Security (CORS)">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${data.vulnerable ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                        {data.vulnerable ? (
                            <Unlock className="w-5 h-5 text-red-500" />
                        ) : (
                            <Lock className="w-5 h-5 text-emerald-500" />
                        )}
                    </div>

                    <div>
                        <div className={`font-bold ${data.vulnerable ? 'text-red-400' : 'text-emerald-400'}`}>
                            {data.vulnerable ? "Misconfigured CORS" : "Secure Config"}
                        </div>
                        {data.vulnerable && (
                            <div className="text-[10px] font-mono text-neutral-500 mt-1">
                                Allowed Origin: {data.acao_header}
                            </div>
                        )}
                    </div>
                </div>

                {data.vulnerable && (
                    <div className="text-[10px] font-bold bg-red-950 text-red-400 px-2 py-1 rounded border border-red-500/20">
                        {data.severity}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CORSScanner;
