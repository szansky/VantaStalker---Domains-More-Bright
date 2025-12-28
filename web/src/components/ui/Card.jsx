import React from 'react';

const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`relative group overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-white/20 ${className}`}>
            {/* Glossy sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Header */}
            {title && (
                <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center gap-3">
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <h3 className="text-sm font-bold text-neutral-200 tracking-wider uppercase font-mono">
                        {title}
                    </h3>
                </div>
            )}

            <div className="p-6 relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;
