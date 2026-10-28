import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  AlertCircle, 
  GraduationCap, 
  BookOpen, 
  FileText,
  Sparkles
} from 'lucide-react';
import { PracticeQuestion } from '../types';

interface PracticeQuizProps {
  questions: PracticeQuestion[];
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'short' | 'conceptual' | 'long'>('all');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    if (activeTab === 'all') return true;
    return q.type === activeTab;
  });

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setRevealedIds(next);
  };

  const revealAll = () => {
    setRevealedIds(new Set(questions.map((q) => q.id)));
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  const toggleComplete = (id: string) => {
    const next = new Set(completedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCompletedIds(next);
  };

  const copyQnA = (q: PracticeQuestion) => {
    const text = `Question: ${q.question}\nAnswer: ${q.answer}${q.requiresExternalKnowledge && q.externalKnowledgeNote ? `\n(Note: ${q.externalKnowledgeNote})` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shortCount = questions.filter((q) => q.type === 'short').length;
  const conceptualCount = questions.filter((q) => q.type === 'conceptual').length;
  const longCount = questions.filter((q) => q.type === 'long').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            Practice Examination Questions ({questions.length})
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            10 grounded practice questions: 5 short-answer, 3 conceptual, and 2 descriptive.
          </p>
        </div>

        {/* Global Reveal / Hide */}
        <div className="flex items-center gap-2">
          <button
            onClick={revealAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Reveal All</span>
          </button>
          <button
            onClick={hideAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide Answers</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          All Questions ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('short')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'short'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          Short-Answer ({shortCount})
        </button>
        <button
          onClick={() => setActiveTab('conceptual')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'conceptual'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          Conceptual ({conceptualCount})
        </button>
        <button
          onClick={() => setActiveTab('long')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'long'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          Long / Descriptive ({longCount})
        </button>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isRevealed = revealedIds.has(q.id);
          const isDone = completedIds.has(q.id);
          const typeBadge =
            q.type === 'short'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : q.type === 'conceptual'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

          return (
            <div
              key={q.id || idx}
              className={`rounded-2xl border transition-all ${
                isDone
                  ? 'bg-zinc-900/40 border-emerald-900/40'
                  : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700/80'
              } p-5 space-y-3`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${typeBadge}`}>
                    {q.type}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    #{idx + 1}
                  </span>
                  {isDone && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyQnA(q)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Copy question & answer"
                  >
                    {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => toggleComplete(q.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-700'
                    }`}
                  >
                    {isDone ? 'Marked' : 'Mark Reviewed'}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h4 className="text-base font-semibold text-zinc-100 leading-snug">
                {q.question}
              </h4>

              {/* External Knowledge Notice if flagged */}
              {q.requiresExternalKnowledge && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Requires Supplemental Academic Context: </span>
                    {q.externalKnowledgeNote || 'This question extends beyond facts explicitly articulated in the transcript.'}
                  </div>
                </div>
              )}

              {/* Active Recall Scratchpad (if answer hidden) */}
              {!isRevealed && (
                <div className="pt-1">
                  <textarea
                    value={userNotes[q.id] || ''}
                    onChange={(e) =>
                      setUserNotes({ ...userNotes, [q.id]: e.target.value })
                    }
                    placeholder="Test your active recall: type your answer before revealing..."
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              )}

              {/* Reveal Toggle & Answer Section */}
              <div className="pt-2">
                <button
                  onClick={() => toggleReveal(q.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hide Model Answer
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Reveal Model Answer
                    </>
                  )}
                </button>

                {isRevealed && (
                  <div className="mt-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-sm leading-relaxed space-y-2 animate-fade-in">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Model Solution
                    </div>
                    <div className="text-zinc-200">{q.answer}</div>
                    {userNotes[q.id] && (
                      <div className="pt-2 mt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-300">Your formulation: </span>
                        {userNotes[q.id]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Accuracy disclaimer */}
      <div className="text-center text-xs text-zinc-500 py-3">
        * Practice questions are generated directly from lecture concepts to test understanding. Examination questions may vary based on syllabus.
      </div>
    </div>
  );
};
