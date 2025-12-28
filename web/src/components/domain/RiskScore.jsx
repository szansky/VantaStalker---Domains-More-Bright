import React from 'react';
import Card from '../ui/Card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const RiskScore = ({ data = { score: 0, grade: 'F', red_flags: [], positive_signals: [], summary: 'Loading...' } }) => {

    const width = 120;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (data.score / 100) * circumference;

    const scoreColor = (score) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const scoreTextColor = (score) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 70) return 'text-blue-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-red-400';
    };

    const getStrokeColor = (score) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <Card title="Trust Score & Risk Analysis">
            <div className="flex items-center gap-6 mb-6">
                {/* Score Gauge */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                            cx="60" cy="60" r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-neutral-900"
                        />
                        <circle
                            cx="60" cy="60" r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className={`${getStrokeColor(data.score)} transition-all duration-1000 ease-out`}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className={`text-2xl font-black ${scoreTextColor(data.score)}`}>{data.grade}</span>
                        <span className="text-[10px] text-neutral-500 font-bold uppercase">{data.score}/100</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-200 mb-1">Project Health</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">{data.summary}</p>
                </div>
            </div>

            {/* Red Flags */}
            {data.red_flags && data.red_flags.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-xs text-red-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        Risk Factors Detected
                    </h4>
                    <ul className="space-y-2">
                        {data.red_flags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-red-300 bg-red-900/10 p-2 rounded border border-red-900/20">
                                <span>⚠️</span> {flag}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Positive Signals */}
            {data.positive_signals && data.positive_signals.length > 0 && (
                <div>
                    <h4 className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-2">Positive Signals</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.positive_signals.map((sig, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-medium bg-emerald-900/20 text-emerald-300 rounded border border-emerald-900/30">
                                {sig}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default RiskScore;
