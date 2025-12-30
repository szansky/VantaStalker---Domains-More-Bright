import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const DNSSECCheck = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="DNSSEC">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }

  return (
    <Card title="DNSSEC">
      <div className="flex items-center gap-2 text-xs">
        <Badge variant={data.enabled ? 'success' : 'warning'}>
          {data.enabled ? 'Enabled' : 'Not enabled'}
        </Badge>
        <Badge variant={data.dnskey ? 'success' : 'warning'}>DNSKEY</Badge>
        <Badge variant={data.ds ? 'success' : 'warning'}>DS</Badge>
      </div>
    </Card>
  );
};

export default DNSSECCheck;
