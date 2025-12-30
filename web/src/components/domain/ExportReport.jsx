import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const toHtmlReport = (snapshot, normalized) => {
  const target = snapshot?.target || 'Unknown target';
  const collectedAt = snapshot?.collected_at || '';
  const score = normalized?.score || {};
  const tech = normalized?.tech || [];
  const ports = normalized?.ports?.open_ports || [];
  const risky = normalized?.ports?.risky_ports || [];
  const correlations = normalized?.correlations || [];

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>VantaStalker Report - ${target}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
      h1 { margin: 0 0 8px; }
      h2 { margin: 24px 0 8px; }
      .muted { color: #666; }
      .pill { display: inline-block; padding: 2px 8px; border-radius: 12px; background: #eee; margin-right: 6px; font-size: 12px; }
      .section { margin-bottom: 16px; }
      ul { margin: 6px 0 0 18px; }
      pre { background: #f6f6f6; padding: 10px; border-radius: 6px; overflow: auto; }
    </style>
  </head>
  <body>
    <h1>VantaStalker Report</h1>
    <div class="muted">Target: ${target}</div>
    <div class="muted">Collected: ${collectedAt}</div>

    <h2>Score</h2>
    <div class="section">
      <span class="pill">Score ${score.score ?? '—'}</span>
      <span class="pill">Grade ${score.grade || '—'}</span>
      <span class="pill">Red flags ${score.red_flags?.length || 0}</span>
      <span class="pill">Positives ${score.positive_signals?.length || 0}</span>
    </div>

    <h2>Tech Stack</h2>
    <div class="section">${tech.length ? tech.join(', ') : 'No data'}</div>

    <h2>Ports</h2>
    <div class="section">
      <div>Open ports: ${ports.length ? ports.join(', ') : 'No data'}</div>
      <div>Risky ports: ${risky.length ? risky.join(', ') : 'None'}</div>
    </div>

    <h2>Correlations</h2>
    <div class="section">
      ${correlations.length ? `<ul>${correlations.map((c) => `<li><strong>${c.title}</strong> — ${c.detail}</li>`).join('')}</ul>` : 'None'}
    </div>

    <h2>Raw Snapshot</h2>
    <pre>${JSON.stringify(snapshot, null, 2)}</pre>
  </body>
</html>`;
};

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const ExportReport = ({ snapshot, normalized }) => {
  if (!snapshot) return null;

  const target = snapshot.target || 'target';
  const fileBase = target.replace(/[^a-z0-9-_]+/gi, '_');

  const handleExportJson = () => {
    const payload = { ...snapshot, normalized };
    downloadFile(JSON.stringify(payload, null, 2), `${fileBase}.json`, 'application/json');
  };

  const handleExportHtml = () => {
    const html = toHtmlReport(snapshot, normalized);
    downloadFile(html, `${fileBase}.html`, 'text/html');
  };

  const handleExportPdf = () => {
    const html = toHtmlReport(snapshot, normalized);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 300);
  };

  const handleCopySummary = async () => {
    const score = normalized?.score || {};
    const risky = normalized?.ports?.risky_ports || [];
    const summary = [
      `Target: ${snapshot.target || 'n/a'}`,
      `Collected: ${snapshot.collected_at || 'n/a'}`,
      `Score: ${score.score ?? 'n/a'} (${score.grade || 'n/a'})`,
      `Risky ports: ${risky.length ? risky.join(', ') : 'none'}`,
      `Tech: ${(normalized?.tech || []).join(', ') || 'n/a'}`
    ].join('\n');
    await navigator.clipboard.writeText(summary);
  };

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">Export report</div>
          <Badge variant="info">Ready</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportJson}
            className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded px-3 py-2"
          >
            Download JSON
          </button>
          <button
            onClick={handleExportHtml}
            className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded px-3 py-2"
          >
            Download HTML
          </button>
          <button
            onClick={handleExportPdf}
            className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded px-3 py-2"
          >
            Export PDF
          </button>
          <button
            onClick={handleCopySummary}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded px-3 py-2"
          >
            Copy summary
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ExportReport;
