import React from 'react';
import Card from '../ui/Card';
import { Image, Copy, ExternalLink } from 'lucide-react';

const FaviconHash = ({ data }) => {
    if (!data?.found) return null;

    const copyHash = async () => {
        if (data.shodan_query) {
            await navigator.clipboard.writeText(data.shodan_query);
        }
    };

    return (
        <Card title="Favicon Fingerprint">
            <div className="flex items-start gap-4">

                {/* Favicon Preview */}
                <div className="w-16 h-16 bg-neutral-900 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                    {data.url ? (
                        <img src={data.url} alt="Favicon" className="w-12 h-12 object-contain" />
                    ) : (
                        <Image className="w-6 h-6 text-neutral-600" />
                    )}
                </div>

                {/* Hash Info */}
                <div className="flex-1 space-y-2">
                    {data.md5 && (
                        <div>
                            <div className="text-[9px] text-neutral-500 uppercase">MD5</div>
                            <div className="text-[10px] font-mono text-neutral-400 truncate">{data.md5}</div>
                        </div>
                    )}

                    {data.mmh3 && typeof data.mmh3 === 'number' && (
                        <div>
                            <div className="text-[9px] text-neutral-500 uppercase">Shodan Hash (mmh3)</div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-blue-400">{data.mmh3}</span>
                                <button
                                    onClick={copyHash}
                                    className="text-neutral-500 hover:text-blue-400 transition-colors"
                                    title="Copy Shodan Query"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}

                    {data.shodan_query && (
                        <a
                            href={`https://www.shodan.io/search?query=${encodeURIComponent(data.shodan_query)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 mt-1"
                        >
                            Search on Shodan <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    )}
                </div>

            </div>
        </Card>
    );
};

export default FaviconHash;
