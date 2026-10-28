import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { KnowledgeGap } from '../types';

interface KnowledgeGapsViewProps {
  gaps: KnowledgeGap[];
  takeaways: string[];
}

export const KnowledgeGapsView: React.FC<KnowledgeGapsViewProps> = ({ gaps, takeaways }) => {
  return (
    <div className="space-y-8">
      {/* Final 5 Takeaways Section (Section 10) */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-950 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              The 5 Crucial Takeaways for Examination Day
            </h3>
            <p className="text-xs text-zinc-400">
              If you only remember five concepts when entering the examination hall, remember these.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          {takeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-3 hover:border-indigo-500/40 transition-colors"
            >
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <p className="text-sm font-medium text-zinc-200 leading-snug">
                {takeaway}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Requiring Further Clarification (Section 9) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              Topics Requiring Further Clarification & Transcript Gaps
            </h3>
            <p className="text-xs text-zinc-400">
              Incomplete lecturer explanations, unstated premises, or ambiguous phrasing in the raw speech.
            </p>
          </div>
        </div>

        {gaps.length === 0 ? (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-200">
              No Significant Knowledge Gaps Identified
            </h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              The lecturer presented the core concepts with sufficient context and complete explanatory chains.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {gaps.map((gap, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <span className="h-5 w-5 rounded bg-amber-500/10 text-amber-400 text-xs font-mono flex items-center justify-center">
                      !
                    </span>
                    {gap.issue}
                  </h4>
                  {gap.isSignificant && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                      Important Gap
                    </span>
                  )}
                </div>

                {/* Quoted Transcript Context */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-300 block mb-1">
                    Transcript Quote / Context:
                  </span>
                  <p className="italic">"{gap.contextInTranscript}"</p>
                </div>

                {/* Why it's incomplete */}
                <div className="text-xs text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-amber-400">Analysis: </span>
                  {gap.explanationOfGap}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
