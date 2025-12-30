import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const DNSSecurity = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="DNS Security">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }

  return (
    <Card title="DNS Security">
      <div className="space-y-2 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <Badge variant={data.spf?.present ? 'success' : 'warning'}>SPF</Badge>
          <span>{data.spf?.present ? 'Present' : 'Missing'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={data.dmarc?.present ? 'success' : 'warning'}>DMARC</Badge>
          <span>{data.dmarc?.present ? 'Present' : 'Missing'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={data.dkim?.selectors_found?.length ? 'success' : 'warning'}>DKIM</Badge>
          <span>{data.dkim?.selectors_found?.length ? data.dkim.selectors_found.join(', ') : 'Not found'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={data.zone_transfer?.vulnerable ? 'danger' : 'success'}>Zone Transfer</Badge>
          <span>{data.zone_transfer?.vulnerable ? 'Vulnerable' : 'Not vulnerable'}</span>
        </div>
      </div>
    </Card>
  );
};

export default DNSSecurity;
