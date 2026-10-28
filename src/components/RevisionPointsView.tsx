import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  Copy, 
  Check, 
  Bookmark, 
  AlertTriangle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RevisionPoint } from '../types';

interface RevisionPointsViewProps {
  points: RevisionPoint[];
}

export const RevisionPointsView: React.FC<RevisionPointsViewProps> = ({ points }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [checkedPoints, setCheckedPoints] = useState<Set<number>>(new Set());

  const categories = Array.from(new Set(points.map((p) => p.category).filter(Boolean)));

  const filteredPoints = points.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const toggleCheck = (idx: number) => {
    const next = new Set(checkedPoints);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setCheckedPoints(next);
  };

  const copyAll = () => {
    const text = points
      .map((p) => `- [${p.category || 'Note'}] ${p.point}${p.mnemonic ? ` (Mnemonic: ${p.mnemonic})` : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Quick High-Yield Revision Points ({points.length})
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Concise last-minute exam cram notes: facts, steps, comparisons, and lecturer emphases.
          </p>
        </div>

        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied all points</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy points</span>
            </>
          )}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-zinc-950 font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          All Points ({points.length})
        </button>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {cat} ({points.filter((p) => p.category === cat).length})
          </button>
        ))}
      </div>

      {/* Checklist / Cards */}
      <div className="space-y-3">
        {filteredPoints.map((pt, idx) => {
          const isChecked = checkedPoints.has(idx);
          const isLecturerEmphasis = pt.category?.toLowerCase().includes('emphasis');

          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                isChecked
                  ? 'bg-zinc-950/60 border-zinc-850 opacity-60'
                  : isLecturerEmphasis
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                  : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Checkbox button */}
              <div className="mt-0.5 flex-shrink-0">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-zinc-700 bg-zinc-800'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Point content */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded font-mono font-semibold uppercase ${
                      isLecturerEmphasis
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {pt.category || 'Fact'}
                  </span>
                  {isLecturerEmphasis && (
                    <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Stressed in lecture
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm leading-relaxed ${
                    isChecked ? 'line-through text-zinc-500' : 'text-zinc-200'
                  }`}
                >
                  {pt.point}
                </p>

                {pt.mnemonic && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs mt-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="font-semibold">Mnemonic:</span>
                    <span className="font-mono text-zinc-200">{pt.mnemonic}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
