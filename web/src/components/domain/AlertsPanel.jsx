import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const AlertsPanel = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-neutral-400">Change alerts</div>
        <div className="space-y-2 text-xs">
          {alerts.map((alert, idx) => (
            <div key={`${alert.title}-${idx}`} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="warning">{alert.type}</Badge>
                <div className="text-neutral-200">{alert.title}</div>
              </div>
              <div className="text-neutral-500">{alert.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AlertsPanel;
