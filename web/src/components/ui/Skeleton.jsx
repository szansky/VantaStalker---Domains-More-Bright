import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
    const baseClasses = "animate-pulse bg-white/5 rounded";

    const variants = {
        text: "h-4 w-3/4",
        title: "h-6 w-1/2 mb-4",
        card: "h-64 w-full",
        circle: "h-12 w-12 rounded-full",
        badge: "h-5 w-16 rounded-full"
    };

    return (
        <div className={`${baseClasses} ${variants[variant] || variants.text} ${className}`} />
    );
};

export default Skeleton;
