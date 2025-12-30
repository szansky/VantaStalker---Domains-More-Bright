import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const SecurityTxtQuality = ({ data }) => {
  if (!data) return null;
  if (data.error) {
    return (
      <Card title="security.txt Quality">
        <div className="text-xs text-red-400">{data.error}</div>
      </Card>
    );
  }
  if (data.present === false) {
    return (
      <Card title="security.txt Quality">
        <div className="text-xs text-neutral-500">security.txt not found.</div>
      </Card>
    );
  }
  return (
    <Card title="security.txt Quality">
      <div className="flex items-center gap-2 text-xs">
        <Badge variant={data.has_contact ? 'success' : 'warning'}>Contact</Badge>
        <Badge variant={data.has_expires ? 'success' : 'warning'}>Expires</Badge>
      </div>
      {(data.findings || []).length > 0 && (
        <div className="text-xs text-neutral-400 mt-2 space-y-1">
          {data.findings.map((f, idx) => <div key={idx}>- {f}</div>)}
        </div>
      )}
    </Card>
  );
};

export default SecurityTxtQuality;
