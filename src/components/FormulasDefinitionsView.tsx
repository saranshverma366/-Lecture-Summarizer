import React, { useState } from 'react';
import { 
  Calculator, 
  Search, 
  HelpCircle, 
  Layers, 
  Info, 
  BookMarked,
  Filter
} from 'lucide-react';
import { DefinitionOrFormula } from '../types';

interface FormulasDefinitionsViewProps {
  items: DefinitionOrFormula[];
}

export const FormulasDefinitionsView: React.FC<FormulasDefinitionsViewProps> = ({ items }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.termOrEquation.toLowerCase().includes(search.toLowerCase()) ||
      item.explanation.toLowerCase().includes(search.toLowerCase()) ||
      (item.variablesAndSymbols && item.variablesAndSymbols.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    return item.type?.toLowerCase() === filterType.toLowerCase();
  });

  const formulaCount = items.filter((i) => i.type?.toLowerCase() === 'formula').length;
  const defCount = items.filter((i) => i.type?.toLowerCase() === 'definition').length;
  const lawCount = items.filter((i) => ['law', 'principle'].includes(i.type?.toLowerCase() || '')).length;

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            Important Definitions & Formula Bank ({items.length})
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Equations, parameter symbols, units of measurement, and conditions of application.
          </p>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search formulas or terms..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            filterType === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          All ({items.length})
        </button>
        {formulaCount > 0 && (
          <button
            onClick={() => setFilterType('formula')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'formula'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            Formulas & Equations ({formulaCount})
          </button>
        )}
        {defCount > 0 && (
          <button
            onClick={() => setFilterType('definition')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'definition'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            Definitions ({defCount})
          </button>
        )}
        {lawCount > 0 && (
          <button
            onClick={() => setFilterType('law')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'law'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            Laws & Principles ({lawCount})
          </button>
        )}
      </div>

      {/* Grid of Formula / Definition cards */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 bg-zinc-900/40 rounded-2xl border border-zinc-800">
          No formulas or definitions match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, idx) => {
            const isFormula = item.type?.toLowerCase() === 'formula';
            return (
              <div
                key={idx}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        isFormula
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {item.type || 'Definition'}
                    </span>
                    {item.isSupplementary && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Supplementary Clarification
                      </span>
                    )}
                  </div>

                  {/* Term or Equation Display */}
                  <div className="py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-800/80 mb-3">
                    <code className="text-sm sm:text-base font-mono font-bold text-amber-200 break-words">
                      {item.termOrEquation}
                    </code>
                  </div>

                  {/* Explanation */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                {/* Variables, Units, and Conditions */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
                  {item.variablesAndSymbols && (
                    <div className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">Variables / Symbols: </span>
                      <span className="font-mono text-zinc-300">{item.variablesAndSymbols}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                    {item.units && (
                      <div className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        <span className="text-zinc-500">Units: </span>
                        {item.units}
                      </div>
                    )}
                    {item.conditionsOfApplication && (
                      <div className="px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400">
                        <span className="text-zinc-500">Conditions: </span>
                        {item.conditionsOfApplication}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
