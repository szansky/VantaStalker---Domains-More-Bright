import React from 'react';
import Card from '../ui/Card';
import { MapPin } from 'lucide-react';

const GeoLocation = ({ data }) => {
    if (!data) return null;

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`;

    return (
        <Card title="Server Location">
            <div className="flex items-center gap-4 bg-neutral-900/50 p-4 rounded-lg border border-white/5">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                    <MapPin className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold text-neutral-200 truncate">
                        {data.city}, {data.country}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono mt-1">
                        ISP: {data.isp || 'Unknown'}
                    </div>
                </div>

                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded transition-colors"
                >
                    View Map
                </a>
            </div>
        </Card>
    );
};

export default GeoLocation;
