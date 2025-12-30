import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const formatTimestamp = (ts) => {
  if (!ts) return '';
  const iso = ts.replace(
    /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?/,
    '$1-$2-$3T$4:$5:$6Z'
  );
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return ts;
  return date.toLocaleString();
};

const SearchHistory = ({ history, diff }) => {
  if (!history) return null;

  const historyItems = history.items || [];
  const last = historyItems.length ? historyItems[historyItems.length - 1] : null;
  const counts = diff?.counts;
  const diffItems = diff?.items || [];

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">Search history</div>
          <Badge variant="info">{historyItems.length} total</Badge>
        </div>

        <div className="text-sm text-neutral-300">
          {last ? `Last search: ${formatTimestamp(last.timestamp)}` : 'No previous searches'}
        </div>

        {diff?.has_previous && counts && (
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="success">Added {counts.added}</Badge>
            <Badge variant="warning">Removed {counts.removed}</Badge>
            <Badge variant="info">Changed {counts.changed}</Badge>
          </div>
        )}

        {historyItems.length > 1 && (
          <div className="text-xs text-neutral-500">
            Earlier: {historyItems.slice(0, -1).slice(-3).map((i) => formatTimestamp(i.timestamp)).join(' • ')}
          </div>
        )}

        {diff?.has_previous && diffItems.length > 0 && (
          <div className="text-xs text-neutral-300">
            <div className="mb-2 text-neutral-400">Recent changes</div>
            <div className="max-h-40 overflow-auto space-y-1 pr-1">
              {diffItems.map((item, idx) => (
                <div key={`${item.path}-${idx}`} className="flex items-start gap-2">
                  <Badge variant={item.type === 'added' ? 'success' : item.type === 'removed' ? 'warning' : 'info'}>
                    {item.type}
                  </Badge>
                  <div className="font-mono break-all">{item.path}</div>
                  {'from' in item && 'to' in item && (
                    <div className="text-neutral-500">
                      {String(item.from)} → {String(item.to)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {diff.truncated && (
              <div className="mt-2 text-neutral-500">List truncated.</div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SearchHistory;
