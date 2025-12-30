import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const HostHeaderCheck = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="Host Header Injection">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  return (
    <Card title="Host Header Injection">
      <div className="flex items-center gap-2 text-xs">
        <Badge variant={data.vulnerable ? 'danger' : 'success'}>
          {data.vulnerable ? 'Vulnerable' : 'Not detected'}
        </Badge>
        {data.location && <div className="text-neutral-400">{data.location}</div>}
      </div>
    </Card>
  );
};

export default HostHeaderCheck;
