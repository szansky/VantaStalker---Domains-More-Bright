import React, { useEffect, useState } from 'react';
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

const SnapshotCompare = ({ history, diff, onCompare, loading }) => {
  const items = history?.items || [];
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  useEffect(() => {
    if (items.length >= 2) {
      setA(items[items.length - 2].timestamp);
      setB(items[items.length - 1].timestamp);
    }
  }, [items.length]);

  if (!items.length) return null;

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-neutral-400">Compare snapshots</div>
        <div className="flex flex-col gap-2 text-xs">
          <select
            className="bg-neutral-900 border border-white/10 rounded px-3 py-2 text-neutral-200"
            value={a}
            onChange={(e) => setA(e.target.value)}
          >
            <option value="">Select first snapshot</option>
            {items.map((item) => (
              <option key={item.timestamp} value={item.timestamp}>
                {formatTimestamp(item.timestamp)}
              </option>
            ))}
          </select>
          <select
            className="bg-neutral-900 border border-white/10 rounded px-3 py-2 text-neutral-200"
            value={b}
            onChange={(e) => setB(e.target.value)}
          >
            <option value="">Select second snapshot</option>
            {items.map((item) => (
              <option key={item.timestamp} value={item.timestamp}>
                {formatTimestamp(item.timestamp)}
              </option>
            ))}
          </select>
          <button
            disabled={!a || !b || loading}
            onClick={() => onCompare(a, b)}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded px-3 py-2"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>

        {diff?.diff && (
          <div className="text-xs text-neutral-300">
            <div className="flex gap-2 mb-2">
              <Badge variant="success">Added {diff.diff.counts.added}</Badge>
              <Badge variant="warning">Removed {diff.diff.counts.removed}</Badge>
              <Badge variant="info">Changed {diff.diff.counts.changed}</Badge>
            </div>
            <div className="max-h-40 overflow-auto space-y-1 pr-1">
              {diff.diff.items.map((item, idx) => (
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
            {diff.diff.truncated && (
              <div className="mt-2 text-neutral-500">List truncated.</div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SnapshotCompare;
