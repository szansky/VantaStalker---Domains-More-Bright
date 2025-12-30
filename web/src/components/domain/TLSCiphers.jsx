import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const TLSCiphers = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="Weak TLS Ciphers">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  const weak = data.weak_ciphers_supported || [];
  return (
    <Card title="Weak TLS Ciphers">
      {weak.length ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {weak.map((c) => <Badge key={c} variant="warning">{c}</Badge>)}
        </div>
      ) : (
        <div className="text-xs text-neutral-500">No weak ciphers detected.</div>
      )}
    </Card>
  );
};

export default TLSCiphers;
