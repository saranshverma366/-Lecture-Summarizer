import React, { useState } from 'react';
import { Lightbulb, Tag, Search, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { KeyConcept } from '../types';

interface KeyConceptsViewProps {
  concepts: KeyConcept[];
}

export const KeyConceptsView: React.FC<KeyConceptsViewProps> = ({ concepts }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Collect all unique related concepts for quick tagging
  const allTags = Array.from(
    new Set(
      concepts.flatMap((c) => c.relatedConcepts || []).filter(Boolean)
    )
  );

  const filteredConcepts = concepts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.simpleExplanation.toLowerCase().includes(search.toLowerCase()) ||
      c.importantDetails.toLowerCase().includes(search.toLowerCase()) ||
      (c.example && c.example.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedTag) {
      return c.relatedConcepts?.includes(selectedTag);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Key Concepts Explained ({concepts.length})
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Core subject ideas explained in simple terms, backed by technical nuance and examples.
          </p>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search concepts..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Related Tags Quick Filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-zinc-400">
          <span className="text-zinc-500 text-[11px] font-semibold uppercase">Related topics:</span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px]"
            >
              Clear tag ({selectedTag}) ✕
            </button>
          )}
          {allTags.slice(0, 8).map((tag, i) => (
            <button
              key={i}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2 py-0.5 rounded-full text-[11px] transition-colors ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Concepts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConcepts.map((concept, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Name & Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{concept.name}</span>
                </h4>
              </div>

              {/* Simple explanation */}
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 mb-3">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Simple Explanation
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {concept.simpleExplanation}
                </p>
              </div>

              {/* Important details */}
              <div className="space-y-1 text-xs text-zinc-300 leading-relaxed">
                <span className="font-semibold text-zinc-400 block">Crucial Mechanics & Details:</span>
                <p>{concept.importantDetails}</p>
              </div>

              {/* Example if available */}
              {concept.example && (
                <div className="mt-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                  <span className="font-semibold text-amber-300 block mb-0.5">Example:</span>
                  <p className="italic text-zinc-400">{concept.example}</p>
                </div>
              )}
            </div>

            {/* Related concepts tags */}
            {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
              <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-zinc-500">Connected:</span>
                {concept.relatedConcepts.map((rel, rIdx) => (
                  <span
                    key={rIdx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/60"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
