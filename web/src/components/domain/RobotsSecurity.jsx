import React from 'react';
import Card from '../ui/Card';

const RobotsSecurity = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="Robots Heuristics">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  return (
    <Card title="Robots Heuristics">
      {data.present === false ? (
        <div className="text-xs text-neutral-500">robots.txt not found.</div>
      ) : (
        <div className="text-xs text-neutral-300 space-y-1">
          <div>Disallow entries: {data.disallow_count ?? 0}</div>
          {(data.findings || []).length ? (
            (data.findings || []).map((f, idx) => <div key={idx}>- {f}</div>)
          ) : (
            <div className="text-neutral-500">No risky paths detected.</div>
          )}
        </div>
      )}
    </Card>
  );
};

export default RobotsSecurity;
