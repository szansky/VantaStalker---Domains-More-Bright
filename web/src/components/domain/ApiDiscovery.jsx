import React from 'react';
import Card from '../ui/Card';

const ApiDiscovery = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="API Discovery">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  const found = data.found || [];
  return (
    <Card title="API Discovery">
      {found.length ? (
        <div className="text-xs text-neutral-300 space-y-1">
          {found.map((f, idx) => (
            <div key={`${f.path}-${idx}`}>
              {f.path} ({f.status})
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-neutral-500">No common endpoints found.</div>
      )}
    </Card>
  );
};

export default ApiDiscovery;
