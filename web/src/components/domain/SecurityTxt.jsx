import React from 'react';
import Card from '../ui/Card';
import { Shield, Mail, Link, Users } from 'lucide-react';

const SecurityTxt = ({ data }) => {
    if (!data?.found) return null;

    return (
        <Card title="Security.txt">
            <div className="space-y-3">

                {/* Contact */}
                {data.contact?.length > 0 && (
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> Security Contact
                        </div>
                        {data.contact.map((c, idx) => (
                            <a
                                key={idx}
                                href={c.startsWith('mailto:') ? c : `mailto:${c}`}
                                className="block text-sm text-emerald-400 hover:text-emerald-300 font-mono truncate"
                            >
                                {c}
                            </a>
                        ))}
                    </div>
                )}

                {/* Policy */}
                {data.policy && (
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1 flex items-center gap-1">
                            <Link className="w-3 h-3" /> Security Policy
                        </div>
                        <a
                            href={data.policy}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 truncate block"
                        >
                            {data.policy}
                        </a>
                    </div>
                )}

                {/* Hiring */}
                {data.hiring && (
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mb-1 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Security Jobs
                        </div>
                        <a
                            href={data.hiring}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300 truncate block"
                        >
                            {data.hiring}
                        </a>
                    </div>
                )}

                {/* Expires */}
                {data.expires && (
                    <div className="text-[10px] text-neutral-500">
                        Expires: <span className="text-neutral-300">{data.expires}</span>
                    </div>
                )}

            </div>
        </Card>
    );
};

export default SecurityTxt;
