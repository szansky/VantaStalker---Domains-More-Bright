import React from 'react';
import Card from '../ui/Card';
import { Shield, ShieldOff, Zap } from 'lucide-react';

const WAFDetector = ({ data }) => {
    if (!data?.evidence && !data?.has_waf) return null;

    return (
        <Card title="Firewall Detection (WAF)">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {data.has_waf ? (
                        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                    ) : (
                        <div className="p-2 bg-neutral-800 rounded-lg">
                            <ShieldOff className="w-6 h-6 text-neutral-500" />
                        </div>
                    )}

                    <div>
                        <div className={`text-lg font-bold ${data.has_waf ? 'text-blue-300' : 'text-neutral-400'}`}>
                            {data.has_waf ? data.waf_name : "No WAF Detected"}
                        </div>
                        {data.has_waf && (
                            <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                                {data.evidence}
                            </div>
                        )}
                    </div>
                </div>

                {data.has_waf && (
                    <div className="text-[10px] bg-blue-950 px-2 py-1 rounded text-blue-400 border border-blue-500/20">
                        ACTIVE PROTECTION
                    </div>
                )}
            </div>
        </Card>
    );
};

export default WAFDetector;
