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

const CaseHistory = ({ activeCase, onDownloadSnapshot }) => {
  if (!activeCase) return null;

  const scans = activeCase.scans || [];

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">Case history</div>
          <Badge variant="info">{scans.length} scans</Badge>
        </div>

        {scans.length === 0 && (
          <div className="text-xs text-neutral-500">No scans attached to this case yet.</div>
        )}

        {scans.length > 0 && (
          <div className="space-y-2 text-xs">
            {scans.slice().reverse().map((scan, idx) => (
              <div key={`${scan.domain}-${scan.timestamp}-${idx}`} className="flex items-center justify-between gap-3">
                <div className="text-neutral-300">
                  <div className="font-mono">{scan.domain}</div>
                  <div className="text-neutral-500">{formatTimestamp(scan.timestamp)}</div>
                </div>
                <button
                  onClick={() => onDownloadSnapshot(scan.domain, scan.timestamp)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded px-3 py-2"
                >
                  Download JSON
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CaseHistory;
