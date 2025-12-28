import React from 'react';
import Card from '../ui/Card';
import { Image, Camera, AlertTriangle } from 'lucide-react';

const ScreenshotTool = ({ data }) => {
    if (data?.error) {
        return null; // Don't show if failed
    }

    if (!data?.screenshot_base64) return null;

    return (
        <Card title="Visual Reconnaissance">
            <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black">
                <img
                    src={`data:image/jpeg;base64,${data.screenshot_base64}`}
                    alt="Site Screenshot"
                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />

                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-[10px] text-white flex items-center gap-1 backdrop-blur-sm">
                    <Camera className="w-3 h-3" /> Live Capture
                </div>
            </div>
        </Card>
    );
};

export default ScreenshotTool;
