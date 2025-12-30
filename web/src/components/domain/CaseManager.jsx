import React, { useMemo, useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const CaseManager = ({ cases, activeCaseId, onSelectCase, onCreateCase, onExportCase }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const activeCase = useMemo(
    () => (cases || []).find((c) => c.id === activeCaseId),
    [cases, activeCaseId]
  );

  const handleCreate = (e) => {
    e.preventDefault();
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
    onCreateCase({
      name,
      description,
      status: 'new',
      tags: tagList
    });
    setName('');
    setDescription('');
    setTags('');
  };

  return (
    <Card className="border-white/10">
      <div className="flex flex-col gap-4">
        <div className="text-sm text-neutral-400">Case management</div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-500">Active case</label>
          <select
            className="bg-neutral-900 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200"
            value={activeCaseId || ''}
            onChange={(e) => onSelectCase(e.target.value || null)}
          >
            <option value="">No active case</option>
            {(cases || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {activeCase && (
          <div className="text-xs text-neutral-400 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="info">{activeCase.status}</Badge>
              {activeCase.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
            {activeCase.description && <div>{activeCase.description}</div>}
            <div className="text-neutral-500">
              Scans: {activeCase.scans?.length || 0}
            </div>
            <button
              onClick={() => onExportCase(activeCase.id)}
              className="mt-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded px-3 py-2"
            >
              Export case ZIP
            </button>
          </div>
        )}

        <form onSubmit={handleCreate} className="flex flex-col gap-2">
          <div className="text-xs text-neutral-500">Create new case</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Case name"
            className="bg-neutral-900 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="bg-neutral-900 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tags: client, high, prod"
            className="bg-neutral-900 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200"
          />
          <button
            type="submit"
            className="mt-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded px-3 py-2"
          >
            Create case
          </button>
        </form>
      </div>
    </Card>
  );
};

export default CaseManager;
