import React from 'react';
import Card from '../ui/Card';

const WhoisInfo = ({ data }) => {
    return (
        <Card title="WHOIS Registration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase mb-1">Registrar</h4>
                    <p className="text-neutral-200 font-medium text-lg truncate" title={data.registrar || 'Unknown'}>
                        {data.registrar || 'Unknown'}
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase mb-1">Organization</h4>
                    <p className="text-neutral-200 font-medium text-lg truncate">
                        {data.org || 'Redacted'}
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase mb-1">Created Date</h4>
                    <p className="text-emerald-400 font-mono">
                        {data.creation_date ? new Date(data.creation_date).toLocaleDateString() : 'N/A'}
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase mb-1">Expiry Date</h4>
                    <p className="text-amber-400 font-mono">
                        {data.expiration_date ? new Date(data.expiration_date).toLocaleDateString() : 'N/A'}
                    </p>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">Location</h4>
                    <div className="flex gap-4">
                        <div>
                            <span className="text-[10px] text-neutral-600 block">Country</span>
                            <span className="text-neutral-300">{data.country || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-neutral-600 block">State/City</span>
                            <span className="text-neutral-300">{data.city || data.state || 'N/A'}</span>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default WhoisInfo;
