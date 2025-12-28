import React, { useState } from 'react';
import Card from '../ui/Card';
import { ShieldAlert, CheckCircle, ChevronDown, ChevronUp, Info, AlertTriangle, Lock } from 'lucide-react';

const HEADER_INFO = {
    "Content-Security-Policy": {
        description: "Controls which resources (scripts, images, styles) are allowed to load, preventing execution of unauthorized code.",
        risk: "Without CSP, an attacker can inject malicious scripts (Cross-Site Scripting - XSS) to steal session cookies, login tokens, or redirect users to phishing sites.",
        fix: "Add a 'Content-Security-Policy' header with strict rules. Start with \"default-src 'self';\" and whitelist only necessary domains."
    },
    "X-Frame-Options": {
        description: "Determines whether your site can be embedded in a frame (<iframe>) on other websites.",
        risk: "An attacker can load your site in a transparent iframe on their site (Clickjacking). Users thinking they are clicking a safe button on the attacker's site are actually clicking invisible buttons on yours (e.g., 'Delete Account').",
        fix: "Set the header to 'DENY' (block all framing) or 'SAMEORIGIN' (allow only your own domain)."
    },
    "X-Content-Type-Options": {
        description: "Forces the browser to strictly follow the defined MIME types of files.",
        risk: "Browsers may 'sniff' and execute a file as a different type. For example, an attacker could upload an image file containing malicious JavaScript, and the browser might execute it as a script.",
        fix: "Set the header to 'nosniff'."
    },
    "Strict-Transport-Security": {
        description: "Enforces the use of HTTPS, telling browsers to never connect via insecure HTTP.",
        risk: "An attacker on the same network (e.g., public Wi-Fi) can intercept the initial HTTP request and perform a Man-in-the-Middle (MITM) attack before the redirect to HTTPS happens.",
        fix: "Add 'Strict-Transport-Security' (HSTS) with a long duration, e.g., 'max-age=31536000; includeSubDomains'."
    },
    "Referrer-Policy": {
        description: "Controls how much referrer information (the URL the user came from) is sent when navigating to a new page.",
        risk: "Sensitive information in URLs (e.g., session tokens, user IDs) can leak to third-party analytics or external sites linked from your pages.",
        fix: "Set to 'no-referrer' or 'strict-origin-when-cross-origin' to limit leakage."
    },
    "Permissions-Policy": {
        description: "Manages access to powerful browser features like the camera, microphone, and geolocation.",
        risk: "Malicious scripts or compromised third-party widgets access sensitive hardware or APIs without explicit user consent if policies are too loose.",
        fix: "Define a policy disabling unnecessary features, e.g., 'camera=(), microphone=()'."
    }
};

const SecurityGrade = ({ data = { security_grade: '?', recommendations: [], security_details: {} } }) => {
    // State to track expanded recommendations
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (idx) => {
        setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const gradeColor = (grade) => {
        if (grade === 'A') return 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]';
        if (grade === 'B') return 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]';
        if (grade === 'C') return 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]';
        return 'text-red-500 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]';
    };

    // Helper to find which header info applies to a recommendation string
    const getHeaderInfo = (recString) => {
        for (const [header, info] of Object.entries(HEADER_INFO)) {
            if (recString.includes(header)) {
                return { name: header, ...info };
            }
        }
        return null;
    };

    return (
        <Card title="Security Grade Report">
            <div className="flex flex-col md:flex-row gap-6">

                {/* Big Grade */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-neutral-900/50 p-6 rounded-lg border border-white/5 w-full md:w-32">
                    <div className={`text-6xl font-black tracking-tighter ${gradeColor(data.security_grade)}`}>
                        {data.security_grade || '?'}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-neutral-500 mt-2">Security Grade</div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                    {/* Recommendations */}
                    {data.recommendations?.length > 0 ? (
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                <ShieldAlert className="w-3 h-3" />
                                Improvements Needed
                            </h4>
                            <div className="space-y-2">
                                {data.recommendations.map((rec, idx) => {
                                    const info = getHeaderInfo(rec);
                                    const isExpanded = expanded[idx];

                                    return (
                                        <div key={idx} className="bg-amber-900/10 border-l-2 border-amber-500 overflow-hidden transition-all duration-300">
                                            {/* Header / Clickable Area */}
                                            <div
                                                onClick={() => info && toggleExpand(idx)}
                                                className={`flex items-start justify-between p-3 ${info ? 'cursor-pointer hover:bg-amber-900/20' : ''}`}
                                            >
                                                <span className="text-xs text-neutral-300 font-medium">{rec}</span>
                                                {info && (
                                                    <div className="text-amber-500">
                                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Expanded Educational Content */}
                                            {info && isExpanded && (
                                                <div className="px-3 pb-3 pt-0 text-xs text-neutral-400 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">

                                                    {/* Meaning */}
                                                    <div className="grid grid-cols-[20px_1fr] gap-2">
                                                        <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                                                        <div>
                                                            <span className="block font-bold text-blue-400 mb-0.5">Meaning</span>
                                                            {info.description}
                                                        </div>
                                                    </div>

                                                    {/* Risk */}
                                                    <div className="grid grid-cols-[20px_1fr] gap-2">
                                                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                                                        <div>
                                                            <span className="block font-bold text-red-400 mb-0.5">Hacker Exploitation</span>
                                                            {info.risk}
                                                        </div>
                                                    </div>

                                                    {/* Fix */}
                                                    <div className="grid grid-cols-[20px_1fr] gap-2">
                                                        <Lock className="w-4 h-4 text-emerald-400 mt-0.5" />
                                                        <div>
                                                            <span className="block font-bold text-emerald-400 mb-0.5">How to Fix</span>
                                                            {info.fix}
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/10 p-3 rounded border border-emerald-900/20">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Excellent Configuration! No critical headers missing.</span>
                        </div>
                    )}

                    {/* Header Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                        {Object.entries(data.security_details).map(([name, status]) => (
                            <div key={name} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-neutral-900/30">
                                <span className="text-neutral-500">{name}</span>
                                <span className={status === 'Present' ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default SecurityGrade;
