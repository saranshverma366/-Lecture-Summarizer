import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { DetailedNoteSection } from '../types';

interface DetailedNotesViewProps {
  sections: DetailedNoteSection[];
}

export const DetailedNotesView: React.FC<DetailedNotesViewProps> = ({ sections }) => {
  const [search, setSearch] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredSections = sections.filter((s) => {
    if (!search) return true;
    return (
      s.heading.toLowerCase().includes(search.toLowerCase()) ||
      s.content.toLowerCase().includes(search.toLowerCase()) ||
      (s.keyTakeaways && s.keyTakeaways.some((t) => t.toLowerCase().includes(search.toLowerCase())))
    );
  });

  const copySection = (section: DetailedNoteSection, idx: number) => {
    const text = `### ${section.heading}\n\n${section.content}\n\n${
      section.keyTakeaways?.length ? `Highlights:\n- ${section.keyTakeaways.join('\n- ')}` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Detailed Sequential Lecture Notes ({sections.length} topics)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Logically sequenced notes with clear academic structure and core takeaways.
          </p>
        </div>

        {/* Search Notes */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topic notes..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {filteredSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4 hover:border-zinc-700/80 transition-colors"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-zinc-100">
                  {section.heading}
                </h4>
              </div>

              <button
                onClick={() => copySection(section, idx)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                title="Copy section notes"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Note Content */}
            <div className="text-sm text-zinc-300 leading-relaxed space-y-3 font-sans whitespace-pre-line">
              {section.content}
            </div>

            {/* Key Highlights */}
            {section.keyTakeaways && section.keyTakeaways.length > 0 && (
              <div className="pt-3 border-t border-zinc-800/60 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Key Topic Highlights
                </span>
                <ul className="space-y-1.5">
                  {section.keyTakeaways.map((takeaway, tIdx) => (
                    <li key={tIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
