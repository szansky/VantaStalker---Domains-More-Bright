import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const HeaderQuality = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="Header Quality">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }

  return (
    <Card title="Header Quality">
      <div className="flex items-center gap-3 mb-3">
        <Badge variant="info">Score {data.score ?? '—'}</Badge>
        <Badge variant="success">Grade {data.grade || '—'}</Badge>
      </div>
      {data.issues?.length ? (
        <div className="text-xs text-neutral-400 space-y-1">
          {data.issues.map((issue, idx) => (
            <div key={idx}>- {issue}</div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-neutral-500">No issues detected.</div>
      )}
    </Card>
  );
};

export default HeaderQuality;
