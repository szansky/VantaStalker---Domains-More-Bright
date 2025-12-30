import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const CnameTakeover = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="CNAME Takeover">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  if (!data.has_cname) {
    return (
      <Card title="CNAME Takeover">
        <div className="text-xs text-neutral-500">No CNAME detected.</div>
      </Card>
    );
  }
  return (
    <Card title="CNAME Takeover">
      <div className="text-xs text-neutral-300 space-y-1">
        <div>CNAME: {data.cname}</div>
        <div>Provider: {data.provider || 'unknown'}</div>
        <div>Target resolves: {data.target_resolves ? 'yes' : 'no'}</div>
        <div>
          <Badge variant={data.takeover_risk ? 'danger' : 'success'}>
            {data.takeover_risk ? 'Potential risk' : 'No risk detected'}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default CnameTakeover;
