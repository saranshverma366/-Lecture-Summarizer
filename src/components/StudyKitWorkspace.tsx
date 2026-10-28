import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Calculator, 
  Zap, 
  GraduationCap, 
  Layers, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft,
  Share2,
  Copy,
  Check,
  CheckCircle2
} from 'lucide-react';
import { LectureStudyKit } from '../types';
import { DetailedNotesView } from './DetailedNotesView';
import { KeyConceptsView } from './KeyConceptsView';
import { FormulasDefinitionsView } from './FormulasDefinitionsView';
import { RevisionPointsView } from './RevisionPointsView';
import { PracticeQuiz } from './PracticeQuiz';
import { FlashcardsDeck } from './FlashcardsDeck';
import { KnowledgeGapsView } from './KnowledgeGapsView';
import { FullMarkdownView } from './FullMarkdownView';

interface StudyKitWorkspaceProps {
  studyKit: LectureStudyKit;
  onReset: () => void;
  onOpenAskDrawer: () => void;
}

export const StudyKitWorkspace: React.FC<StudyKitWorkspaceProps> = ({
  studyKit,
  onReset,
  onOpenAskDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'concepts' | 'formulas' | 'revision' | 'practice' | 'flashcards' | 'gaps' | 'markdown'
  >('overview');

  const [copiedSummary, setCopiedSummary] = useState(false);

  const copyExecutiveSummary = () => {
    const text = Array.isArray(studyKit.executiveSummary)
      ? studyKit.executiveSummary.join('\n\n')
      : studyKit.executiveSummary;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const navTabs = [
    { id: 'overview', label: '1. Overview & Summary', icon: Sparkles, count: null },
    { id: 'notes', label: '2. Lecture Notes', icon: BookOpen, count: studyKit.detailedNotes?.length },
    { id: 'concepts', label: '3. Key Concepts', icon: Lightbulb, count: studyKit.keyConcepts?.length },
    { id: 'formulas', label: '4. Formulas & Defs', icon: Calculator, count: studyKit.definitionsAndFormulas?.length },
    { id: 'revision', label: '5. Quick Revision', icon: Zap, count: studyKit.revisionPoints?.length },
    { id: 'practice', label: '6. Practice Exam', icon: GraduationCap, count: studyKit.practiceQuestions?.length },
    { id: 'flashcards', label: '7. Flashcards', icon: Layers, count: studyKit.flashcards?.length },
    { id: 'gaps', label: '8. Gaps & Takeaways', icon: AlertCircle, count: studyKit.finalTakeaways?.length },
    { id: 'markdown', label: '9. Full Markdown (.md)', icon: FileText, count: null },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Paste Another Lecture</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-mono text-[11px]">
            Academic Level: <span className="text-indigo-300 font-semibold">{studyKit.overview?.estimatedComplexity || 'Undergraduate'}</span>
          </span>
        </div>
      </div>

      {/* Hero Overview Card (# 1. Lecture Overview) */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/40 rounded-3xl border border-zinc-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              {studyKit.overview?.subjectDomain || 'Academic Lecture'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono">
              Topic: {studyKit.overview?.mainTopic || 'Core Subject'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            {studyKit.overview?.title || 'Lecture Summary & Study Kit'}
          </h1>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-200">Central Objective: </span>
              {studyKit.overview?.centralObjective || 'Analyze and master the core theoretical principles.'}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="border-b border-zinc-800 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {/* Tab 1: Overview & Executive Summary */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-zinc-100">
                    # 2. Executive Summary
                  </h3>
                </div>

                <button
                  onClick={copyExecutiveSummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Paragraphs */}
              <div className="text-zinc-300 text-sm sm:text-base leading-relaxed space-y-3 font-sans">
                {Array.isArray(studyKit.executiveSummary) ? (
                  studyKit.executiveSummary.map((para, i) => (
                    <p key={i} className="leading-relaxed">
                      {para}
                    </p>
                  ))
                ) : (
                  <p>{studyKit.executiveSummary}</p>
                )}
              </div>
            </div>

            {/* Quick Action Cards Grid for Next Revision Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('revision')}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  Quick Revision ({studyKit.revisionPoints?.length || 0})
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  Bullet points for rapid exam recall and lecturer emphasis.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('flashcards')}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                  Flashcard Drill ({studyKit.flashcards?.length || 0})
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  Interactive 3D active-recall deck with mastery tracking.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('practice')}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
                  Practice Exam ({studyKit.practiceQuestions?.length || 0})
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  5 short, 3 conceptual, and 2 descriptive test questions.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('formulas')}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  Formulas & Defs ({studyKit.definitionsAndFormulas?.length || 0})
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  Rigorous symbol definitions, units, and application conditions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Notes */}
        {activeTab === 'notes' && (
          <DetailedNotesView sections={studyKit.detailedNotes || []} />
        )}

        {/* Tab 3: Key Concepts */}
        {activeTab === 'concepts' && (
          <KeyConceptsView concepts={studyKit.keyConcepts || []} />
        )}

        {/* Tab 4: Formulas & Definitions */}
        {activeTab === 'formulas' && (
          <FormulasDefinitionsView items={studyKit.definitionsAndFormulas || []} />
        )}

        {/* Tab 5: Quick Revision */}
        {activeTab === 'revision' && (
          <RevisionPointsView points={studyKit.revisionPoints || []} />
        )}

        {/* Tab 6: Practice Exam Questions */}
        {activeTab === 'practice' && (
          <PracticeQuiz questions={studyKit.practiceQuestions || []} />
        )}

        {/* Tab 7: Flashcards Deck */}
        {activeTab === 'flashcards' && (
          <FlashcardsDeck cards={studyKit.flashcards || []} />
        )}

        {/* Tab 8: Knowledge Gaps & Takeaways */}
        {activeTab === 'gaps' && (
          <KnowledgeGapsView
            gaps={studyKit.knowledgeGaps || []}
            takeaways={studyKit.finalTakeaways || []}
          />
        )}

        {/* Tab 9: Full Pristine Markdown View */}
        {activeTab === 'markdown' && (
          <FullMarkdownView
            markdown={studyKit.rawMarkdown || ''}
            lectureTitle={studyKit.overview?.title || 'lecture'}
          />
        )}
      </div>
    </div>
  );
};
