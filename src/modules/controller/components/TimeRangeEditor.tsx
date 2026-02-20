'use client';

import { useState, useEffect } from 'react';

type Range = { start: string; end: string; mode: 'Charge' | 'Discharge' };

export function TimeRangeEditor({ value, onChange }: { value: any; onChange: (s: string) => void }) {
  const [ranges, setRanges] = useState<Range[]>(() => parseRanges(value || ''));

  function parseRanges(s: string) {
    if (!s) return [];
    return String(s)
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(' ');
        const range = parts[0] || '00:00-00:00';
        const label = parts.slice(1).join(' ') || 'Charge';
        const [start, end] = range.split('-');
        return { start: start || '00:00', end: end || '00:00', mode: label.toLowerCase().includes('discharge') ? 'Discharge' : 'Charge' } as Range;
      });
  }

  function formatRanges(rs: Range[]) {
    return rs.map((r) => `${r.start}-${r.end} ${r.mode}`).join('\n');
  }

  useEffect(() => {
    setRanges(parseRanges(value || ''));
  }, [value]);

  useEffect(() => {
    onChange(formatRanges(ranges));
  }, [ranges]);

  function updateRange(i: number, patch: Partial<Range>) {
    setRanges((prev) => {
      const next = prev.slice();
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  function addRange() {
    setRanges((prev) => [...prev, { start: '00:00', end: '01:00', mode: 'Charge' }]);
  }

  function removeRange(i: number) {
    setRanges((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      {ranges.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="time"
            value={r.start}
            onChange={(e) => updateRange(i, { start: e.target.value })}
            className="px-2 py-1 text-sm border rounded"
            style={{ background: 'var(--color-input)', color: 'var(--color-card-foreground)', borderColor: 'var(--color-border)' }}
          />
          <span className="text-sm text-gray-600">:</span>
          <input
            type="time"
            value={r.end}
            onChange={(e) => updateRange(i, { end: e.target.value })}
            className="px-2 py-1 text-sm border rounded"
            style={{ background: 'var(--color-input)', color: 'var(--color-card-foreground)', borderColor: 'var(--color-border)' }}
          />
          <select
            value={r.mode}
            onChange={(e) => updateRange(i, { mode: e.target.value as any })}
            className="px-2 py-1 text-sm border rounded w-24"
            style={{ background: r.mode === 'Charge' ? 'var(--color-accent)' : 'var(--secondary)', color: r.mode === 'Charge' ? 'var(--color-accent-foreground)' : 'var(--secondary-foreground)', borderColor: 'var(--color-border)' }}
          >
            <option>Charge</option>
            <option>Discharge</option>
          </select>
          <button type="button" onClick={() => removeRange(i)} className="text-sm" style={{ color: 'var(--color-accent-foreground)', background: 'transparent' }}>Remove</button>
        </div>
      ))}
      <div>
        <button
          type="button"
          onClick={addRange}
          className="px-3 py-1 text-sm rounded"
          style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--color-border)' }}
        >
          Add Range
        </button>
      </div>
    </div>
  );
}
