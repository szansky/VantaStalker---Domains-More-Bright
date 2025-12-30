import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const TLSScanner = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="TLS Scanner">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }

  const supported = data.supported_versions || [];
  const issues = data.issues || [];

  return (
    <Card title="TLS Scanner">
      <div className="flex flex-wrap gap-2 mb-3">
        {supported.length ? supported.map((v) => (
          <Badge key={v} variant={v.includes('1_0') || v.includes('1_1') ? 'warning' : 'success'}>
            {v}
          </Badge>
        )) : <Badge variant="danger">No TLS detected</Badge>}
      </div>
      {issues.length > 0 && (
        <div className="text-xs text-neutral-400 space-y-1">
          {issues.map((issue, idx) => (
            <div key={idx}>- {issue}</div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TLSScanner;
