import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

// Domain/URL validation regex
const DOMAIN_REGEX = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;
const IP_REGEX = /^(?:https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/;

const isValidTarget = (input) => {
    const trimmed = input.trim();
    return DOMAIN_REGEX.test(trimmed) || IP_REGEX.test(trimmed);
};

const SearchForm = ({ onSearch, loading }) => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();

        if (!trimmed) {
            setError('Please enter a domain or IP address.');
            return;
        }

        if (!isValidTarget(trimmed)) {
            setError('Invalid format. Enter a domain (e.g. google.com) or IP address.');
            return;
        }

        setError('');
        onSearch(trimmed);
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (error) setError(''); // Clear error on typing
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group z-20">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-full opacity-30 blur group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />

            <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl">
                {/* Icon */}
                <div className="pl-4 pr-3 text-neutral-500">
                    <Search className="w-6 h-6" />
                </div>

                {/* Input */}
                <input
                    value={query}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter domain (e.g. google.com)"
                    className={`flex-1 bg-transparent text-white placeholder-neutral-500 text-lg font-medium focus:outline-none min-w-0 py-3 ${error ? 'text-red-400' : ''}`}
                />

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="ml-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Scanning...</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 whitespace-nowrap">
                            Analyze <span className="hidden sm:inline">Target</span>
                            <ArrowRight className="w-4 h-4 opacity-80" />
                        </span>
                    )}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </form>
    );
};

export default SearchForm;
