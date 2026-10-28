import React from 'react';
import { Sparkles, BookOpen, Clock, FileText, Bookmark, MessageSquare, Volume2, Download, Printer } from 'lucide-react';
import { LectureStudyKit } from '../types';

interface NavbarProps {
  studyKit: LectureStudyKit | null;
  onNewLecture: () => void;
  onOpenHistory: () => void;
  onOpenAskDrawer: () => void;
  onToggleAudio: () => void;
  isAudioActive: boolean;
  onExportMarkdown: () => void;
  onPrint: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  studyKit,
  onNewLecture,
  onOpenHistory,
  onOpenAskDrawer,
  onToggleAudio,
  isAudioActive,
  onExportMarkdown,
  onPrint,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewLecture}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Synapse
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Revision Assistant
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              AI Lecture Summarizer & Exam Prep
            </p>
          </div>
        </div>

        {/* Center: Current Lecture Badge if loaded */}
        {studyKit && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300 max-w-sm truncate">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate font-medium text-zinc-200">
              {studyKit.overview?.title || 'Active Lecture'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-700 text-zinc-300 rounded font-mono">
              {studyKit.overview?.subjectDomain || 'Lecture'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {studyKit && (
            <>
              {/* Ask Grounded Assistant */}
              <button
                onClick={onOpenAskDrawer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors"
                title="Ask questions about this lecture"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Ask Lecture</span>
              </button>

              {/* Audio Listen */}
              <button
                onClick={onToggleAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  isAudioActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                }`}
                title="Listen to Lecture Summary & Revision Points"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAudioActive ? 'Audio Active' : 'Listen'}</span>
              </button>

              {/* Export Markdown */}
              <button
                onClick={onExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                title="Export as Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Print / Save PDF */}
              <button
                onClick={onPrint}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </>
          )}

          {/* History button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors relative"
            title="Saved Lecture Kits"
          >
            <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500 text-white font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Lecture Button */}
          {studyKit && (
            <button
              onClick={onNewLecture}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-900 transition-colors shadow-sm"
            >
              <span>+ New</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
