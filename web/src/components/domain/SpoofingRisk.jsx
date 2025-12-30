import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const SpoofingRisk = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="Email Spoofing Risk">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  const variant = data.risk === 'low' ? 'success' : data.risk === 'medium' ? 'warning' : 'danger';
  return (
    <Card title="Email Spoofing Risk">
      <div className="flex items-center gap-2 text-xs">
        <Badge variant={variant}>{data.risk || 'unknown'}</Badge>
        <div className="text-neutral-400">
          SPF: {data.spf_present ? 'yes' : 'no'} / DMARC: {data.dmarc_present ? 'yes' : 'no'} / policy: {data.dmarc_policy || 'none'}
        </div>
      </div>
    </Card>
  );
};

export default SpoofingRisk;
