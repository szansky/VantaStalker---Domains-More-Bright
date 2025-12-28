import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
    const variants = {
        default: "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700",
        success: "bg-emerald-950/30 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
        warning: "bg-amber-950/30 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
        danger: "bg-red-950/30 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        info: "bg-blue-950/30 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-300 ${variants[variant] || variants.default}`}>
            {children}
        </span>
    );
};

export default Badge;
