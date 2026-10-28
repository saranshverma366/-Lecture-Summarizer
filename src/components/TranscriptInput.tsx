import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Clock, 
  Type as TypeIcon, 
  Trash2, 
  ClipboardPaste, 
  CheckCircle2, 
  GraduationCap, 
  Zap, 
  Layers, 
  BookOpen, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_LECTURES, SampleLecture } from '../data/sampleLectures';

interface TranscriptInputProps {
  onSubmit: (transcript: string, focusMode: string, customPrompt?: string) => void;
  isLoading: boolean;
}

export const TranscriptInput: React.FC<TranscriptInputProps> = ({ onSubmit, isLoading }) => {
  const [transcript, setTranscript] = useState('');
  const [focusMode, setFocusMode] = useState('Comprehensive Revision Kit (All 10 Sections)');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const words = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const chars = transcript.length;
  const estMins = Math.max(1, Math.round(words / 140)); // ~140 words per minute average lecture pace

  const handleSelectSample = (sample: SampleLecture) => {
    setTranscript(sample.transcript);
    setCopiedNotification(`Loaded "${sample.title}"`);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleClear = () => {
    setTranscript('');
    setCustomPrompt('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTranscript(text);
        setCopiedNotification('Pasted from clipboard!');
        setTimeout(() => setCopiedNotification(null), 2500);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let content = (event.target?.result as string) || '';
      // Clean VTT / SRT timestamps if uploaded
      if (file.name.endsWith('.vtt') || file.name.endsWith('.srt')) {
        content = content
          .replace(/WEBVTT/gi, '')
          .replace(/\d+\r?\n\d\d:\d\d:\d\d[,\.]\d\d\d --> \d\d:\d\d:\d\d[,\.]\d\d\d\r?\n/g, '')
          .replace(/^\d+$/gm, '')
          .replace(/\n\s*\n/g, '\n')
          .trim();
      }
      setTranscript(content);
      setCopiedNotification(`Loaded file: ${file.name}`);
      setTimeout(() => setCopiedNotification(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    onSubmit(transcript, focusMode, showCustomPrompt ? customPrompt : undefined);
  };

  const focusOptions = [
    {
      id: 'Comprehensive Revision Kit (All 10 Sections)',
      title: 'Full Revision Kit',
      desc: 'All 10 sections: Notes, Concepts, Formulas, 10 Qs & Flashcards',
      icon: Layers,
    },
    {
      id: 'Quick Exam Cram',
      title: 'Quick Exam Cram',
      desc: 'Summary, High-Yield Points, Flashcards, 5 Key Takeaways',
      icon: Zap,
    },
    {
      id: 'Conceptual Deep-Dive & Formula Bank',
      title: 'Notes & Formulas',
      desc: 'Detailed sequential notes, core concepts, formula variables & units',
      icon: BookOpen,
    },
    {
      id: 'Exam Practice & Flashcard Drill',
      title: 'Questions & Flashcards',
      desc: 'Practice short/conceptual/long questions + Flashcards deck',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero introduction */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Rigorous Lecture Transcripts → Structured Revision Kits
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Turn Raw Lectures Into High-Yield Exam Material
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Paste your lecture transcript or recording transcript. Synapse extracts executive summaries, detailed sequential notes, formulas with units, quick revision bullets, 10 practice questions, and flashcards.
        </p>
      </div>

      {/* Sample Lecture Quick-Pick */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Try a sample lecture transcript:
          </span>
          {copiedNotification && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> {copiedNotification}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_LECTURES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-left p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 font-medium text-[10px]">
                    {sample.badge}
                  </span>
                  <span className="text-zinc-500 text-[10px]">{sample.duration}</span>
                </div>
                <h4 className="text-xs font-medium text-zinc-200 line-clamp-2 group-hover:text-white transition-colors">
                  {sample.title}
                </h4>
              </div>
              <span className="mt-2 text-[11px] text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Load transcript →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Box */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
        {/* Input Header Toolbar */}
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wide">
              Lecture Transcript Text
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.vtt,.srt"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              title="Upload .txt, .md, .vtt, or .srt"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span>Upload file</span>
            </button>

            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              title="Paste clipboard content"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-zinc-400" />
              <span>Paste</span>
            </button>

            {transcript && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Clear transcript"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your lecture transcript here... (e.g., from Zoom transcripts, Otter.ai, YouTube lecture captions, recorded seminar notes, or professor audio transcriptions)&#10;&#10;Informal speech, conversational filler words, repetitions, and whiteboard notes will all be cleaned, structured, and transformed into an exact revision guide."
            rows={12}
            className="w-full bg-zinc-950 text-zinc-200 p-4 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/40 resize-y leading-relaxed placeholder:text-zinc-600"
          />

          {/* Character & Word counter banner */}
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-900 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <TypeIcon className="w-3.5 h-3.5 text-zinc-500" />
                {words.toLocaleString()} words
              </span>
              <span>{chars.toLocaleString()} characters</span>
              {words > 0 && (
                <span className="flex items-center gap-1 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  ~{estMins} min lecture
                </span>
              )}
            </div>
            {words < 20 && (
              <span className="text-zinc-500 italic">
                Need at least 20 words for revision analysis
              </span>
            )}
          </div>
        </div>

        {/* Revision Focus Mode Selection */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
              Target Revision Mode
            </label>
            <button
              type="button"
              onClick={() => setShowCustomPrompt(!showCustomPrompt)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {showCustomPrompt ? '- Hide Custom Target' : '+ Add Custom Focus (e.g., Exam Midterm, MCQs)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {focusOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = focusMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFocusMode(opt.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                      : 'bg-zinc-800/50 hover:bg-zinc-800 border-zinc-700/60 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-zinc-400'}`} />
                    <span className="text-xs font-semibold">{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Optional Custom Instructions */}
          {showCustomPrompt && (
            <div className="pt-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus especially on proof derivations and prepare for a multiple-choice midterm exam..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Strict factual accuracy: no hallucinations, exact formulas & 10 grounded practice questions.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || words < 20}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
              isLoading || words < 20
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 cursor-pointer hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Transforming Lecture...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Revision Kit</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Feature Guarantee Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
          <h4 className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            10-Section Academic Standard
          </h4>
          <p className="text-zinc-500">
            Overview, Executive Summary, Detailed Notes, Key Concepts, Formula Bank, Revision Points, Practice Questions, Flashcards, Gaps, and Top 5 Takeaways.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
          <h4 className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Active Recall & Spaced Repetition
          </h4>
          <p className="text-zinc-500">
            Interactive 3D flashcards with mastery tracking and self-graded practice exam (5 Short, 3 Conceptual, 2 Long-Answer questions).
          </p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
          <h4 className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Formula & Unit Rigor
          </h4>
          <p className="text-zinc-500">
            Preserves subject terminology, symbols, parameter meanings, units, and application boundaries without fabricating equations.
          </p>
        </div>
      </div>
    </div>
  );
};
