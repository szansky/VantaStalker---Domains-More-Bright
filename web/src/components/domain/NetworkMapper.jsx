import React, { useRef, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import Card from '../ui/Card';
import { ZoomIn, Info } from 'lucide-react';

const NetworkMapper = ({ domain, subdomains, ip, ghost, tech, reverseip }) => {
    const fgRef = useRef();

    // Transform data into graph nodes/links
    const graphData = useMemo(() => {
        const nodes = [];
        const links = [];

        // Central Node (Target Domain)
        if (domain) {
            nodes.push({ id: domain, label: domain, group: 'target', val: 30, desc: 'Target Domain' });
        }

        // IP Node
        if (ip && ip !== 'Scanning...') {
            nodes.push({ id: ip, label: ip, group: 'ip', val: 20, desc: 'Server IP Address' });
            links.push({ source: domain, target: ip });
        }

        // Subdomains
        if (subdomains && subdomains.length > 0) {
            subdomains.forEach(sub => { // No limit
                const hostname = sub.subdomain || sub;
                nodes.push({ id: hostname, label: hostname.replace(`.${domain}`, ''), group: 'subdomain', val: 10, desc: 'Subdomain' });
                links.push({ source: domain, target: hostname });
            });
        }

        // Reverse IP / Shared Hosting Domains
        if (reverseip && reverseip.domains && reverseip.domains.length > 0) {
            reverseip.domains.forEach(rDomain => {
                // Avoid duplicates with target or subdomains
                const exists = nodes.find(n => n.id === rDomain);
                if (!exists && rDomain !== domain) {
                    nodes.push({ id: rDomain, label: rDomain, group: 'related', val: 8, desc: 'Shared IP Domain' });

                    // Link to IP node if exists, else target
                    if (ip && ip !== 'Scanning...') {
                        links.push({ source: ip, target: rDomain });
                    } else {
                        links.push({ source: domain, target: rDomain });
                    }
                }
            });
        }

        return { nodes, links };
    }, [domain, subdomains, ip, reverseip]);

    // Custom Node Rendering
    const paintNode = useCallback((node, ctx, globalScale) => {
        const label = node.label;
        const fontSize = 12 / globalScale;
        const r = node.val / 1.5; // Radius based on value

        // Node Color based on group
        let fill = '#a855f7'; // Default Purple
        if (node.group === 'target') fill = '#ef4444'; // Red
        if (node.group === 'ip') fill = '#3b82f6'; // Blue
        if (node.group === 'subdomain') fill = '#10b981'; // Green
        if (node.group === 'related') fill = '#f59e0b'; // Orange

        // Draw Glow
        const glowColor = fill;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = fill;
        ctx.fill();

        // Reset Shadow for Text
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5 / globalScale;
        ctx.stroke();

        // Text Label (Always visible for Target, IP. Conditional for others)
        const showLabel = node.group === 'target' || node.group === 'ip' || globalScale > 1.2;

        if (showLabel) {
            ctx.font = `${node.group === 'target' ? 'bold ' : ''}${fontSize + 2}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';

            // Draw text background for readability
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + r + 2, bckgDimensions[0], bckgDimensions[1]);

            ctx.fillStyle = '#fff';
            ctx.fillText(label, node.x, node.y + r + 2 + bckgDimensions[1] / 2);
        }
    }, []);

    if (!domain) return null;

    return (
        <Card title="Infrastructure Map (Interactive)">
            <div className="h-[450px] bg-black/90 rounded-lg overflow-hidden border border-white/5 relative cursor-move">
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    nodeCanvasObject={paintNode}
                    nodeLabel={node => `${node.desc}: ${node.id}`}
                    linkColor={() => 'rgba(255,255,255,0.2)'}
                    backgroundColor="#050505"
                    d3AlphaDecay={0.05} // Slower physics settle
                    d3VelocityDecay={0.3} // Less friction
                    onNodeClick={node => {
                        fgRef.current.centerAt(node.x, node.y, 1000);
                        fgRef.current.zoom(6, 2000);
                    }}
                    cooldownTicks={100}
                    onEngineStop={() => fgRef.current.zoomToFit(400, 50)} // Auto zoom to fit when settled
                />

                {/* Helper UI */}
                <div className="absolute top-4 right-4 pointer-events-none text-right space-y-1">
                    <div className="text-[10px] text-neutral-400 bg-black/50 px-2 py-1 rounded backdrop-blur">
                        <ZoomIn className="w-3 h-3 inline mr-1" /> Scroll to Zoom
                    </div>
                    <div className="text-[10px] text-neutral-400 bg-black/50 px-2 py-1 rounded backdrop-blur">
                        <Info className="w-3 h-3 inline mr-1" /> Click Nodes to Focus
                    </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex gap-4 bg-black/60 p-3 rounded-lg border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" /> Target
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> IP Host
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Subdomain
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" /> Shared IP
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default NetworkMapper;
