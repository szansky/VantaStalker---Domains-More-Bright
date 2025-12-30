import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const NormalizedSummary = ({ data }) => {
  if (!data) return null;

  const score = data.score || {};
  const correlations = data.correlations || [];
  const riskyPorts = data.ports?.risky_ports || [];

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">Normalized summary</div>
          <Badge variant="info">Score {score.score ?? '—'}</Badge>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="success">Grade {score.grade || '—'}</Badge>
          <Badge variant="warning">Red flags {score.red_flags?.length || 0}</Badge>
          <Badge variant="info">Positives {score.positive_signals?.length || 0}</Badge>
        </div>

        {riskyPorts.length > 0 && (
          <div className="text-xs text-neutral-300">
            Risky ports: {riskyPorts.join(', ')}
          </div>
        )}

        {correlations.length > 0 && (
          <div className="text-xs text-neutral-300">
            <div className="mb-2 text-neutral-400">Correlations</div>
            <div className="space-y-2">
              {correlations.map((item, idx) => (
                <div key={`${item.title}-${idx}`} className="flex flex-col gap-1">
                  <Badge variant={item.type === 'warning' ? 'warning' : 'info'}>
                    {item.title}
                  </Badge>
                  <div className="text-neutral-500">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default NormalizedSummary;
