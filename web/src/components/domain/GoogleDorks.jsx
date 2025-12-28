import React from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, FileText, Database, ShieldAlert, Code } from 'lucide-react';
import Card from '../ui/Card';

const GoogleDorks = ({ data }) => {
    if (!data || !data.dorks) return null;

    const getIcon = (name) => {
        if (name.includes("Document")) return <FileText className="w-4 h-4 text-blue-400" />;
        if (name.includes("Database") || name.includes("SQL")) return <Database className="w-4 h-4 text-red-400" />;
        if (name.includes("Vulnerabilities") || name.includes("Errors") || name.includes("Login")) return <ShieldAlert className="w-4 h-4 text-orange-400" />;
        if (name.includes("Code") || name.includes("Github") || name.includes("Cloud")) return <Code className="w-4 h-4 text-emerald-400" />;
        return <Search className="w-4 h-4 text-purple-400" />;
    };

    return (
        <Card title="Google Hacking (Dorks)" className="border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.dorks.map((dork, idx) => (
                    <motion.a
                        key={idx}
                        href={dork.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded bg-white/5 border border-white/10 hover:bg-purple-900/20 hover:border-purple-500/50 transition-all group"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="p-2 bg-black/40 rounded-full group-hover:bg-purple-500/20 transition-colors">
                            {getIcon(dork.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-200 group-hover:text-purple-300 truncate">
                                {dork.name}
                            </div>
                            <div className="text-[10px] text-gray-500 group-hover:text-gray-400 truncate">
                                {dork.desc}
                            </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
                * Links open strictly in Google Search. No direct packets sent to target.
            </div>
        </Card>
    );
};

export default GoogleDorks;
