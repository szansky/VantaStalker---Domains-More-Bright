import React from 'react';
import Card from '../ui/Card';

const RedirectCheck = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="Open Redirects">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  const findings = data.findings || [];
  return (
    <Card title="Open Redirects">
      {findings.length ? (
        <div className="text-xs text-neutral-300 space-y-1">
          {findings.map((f, idx) => (
            <div key={`${f.param}-${idx}`}>
              {f.param}: {f.location}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-neutral-500">No open redirect detected.</div>
      )}
    </Card>
  );
};

export default RedirectCheck;
