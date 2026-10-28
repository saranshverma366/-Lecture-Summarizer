/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TranscriptInput } from './components/TranscriptInput';
import { StudyKitWorkspace } from './components/StudyKitWorkspace';
import { AskLectureDrawer } from './components/AskLectureDrawer';
import { SavedLecturesModal } from './components/SavedLecturesModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { LectureStudyKit, SavedLectureSession } from './types';
import { AlertCircle, HelpCircle, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'synapse_lecture_sessions_v1';

export default function App() {
  const [studyKit, setStudyKit] = useState<LectureStudyKit | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidTranscriptNote, setInvalidTranscriptNote] = useState<string | null>(null);

  const [savedSessions, setSavedSessions] = useState<SavedLectureSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  // Load saved lectures on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved sessions from localStorage:', e);
    }
  }, []);

  const saveSessionsToStorage = (sessions: SavedLectureSession[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      setSavedSessions(sessions);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleSubmitTranscript = async (
    transcript: string,
    focusMode: string,
    customPrompt?: string
  ) => {
    setIsLoading(true);
    setError(null);
    setInvalidTranscriptNote(null);
    setCurrentTranscript(transcript);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, focusMode, customPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process lecture transcript.');
      }

      if (data.isValidTranscript === false) {
        setInvalidTranscriptNote(
          data.rejectionReason ||
            'The input provided does not appear to be an educational lecture transcript. Synapse is designed to process spoken lectures, classroom recordings, academic presentations, and seminar transcripts. Please paste a lecture transcript or select one of the curated sample lectures above.'
        );
        setIsLoading(false);
        return;
      }

      setStudyKit(data);

      // Auto-save session
      const newSession: SavedLectureSession = {
        id: `lec-${Date.now()}`,
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        title: data.overview?.title || 'Untitled Lecture',
        subject: data.overview?.subjectDomain || 'General',
        transcriptPreview: transcript.slice(0, 160).replace(/\s+/g, ' ') + '...',
        transcript,
        studyKit: data,
      };

      const updated = [newSession, ...savedSessions.filter((s) => s.title !== newSession.title)];
      saveSessionsToStorage(updated.slice(0, 25)); // keep up to 25
    } catch (err: any) {
      console.error('Summarize error:', err);
      setError(err?.message || 'An error occurred while generating study materials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (session: SavedLectureSession) => {
    setStudyKit(session.studyKit);
    setCurrentTranscript(session.transcript);
    setError(null);
    setInvalidTranscriptNote(null);
  };

  const handleDeleteSession = (id: string) => {
    const updated = savedSessions.filter((s) => s.id !== id);
    saveSessionsToStorage(updated);
  };

  const handleExportMarkdown = () => {
    if (!studyKit) return;
    const filename = `${
      (studyKit.overview?.title || 'lecture_study_kit').replace(/[^a-z0-9]/gi, '_').toLowerCase()
    }.md`;
    const blob = new Blob([studyKit.rawMarkdown || ''], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewLecture = () => {
    setStudyKit(null);
    setError(null);
    setInvalidTranscriptNote(null);
    setIsAudioActive(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        studyKit={studyKit}
        onNewLecture={handleNewLecture}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAskDrawer={() => setIsAskDrawerOpen(true)}
        onToggleAudio={() => setIsAudioActive(!isAudioActive)}
        isAudioActive={isAudioActive}
        onExportMarkdown={handleExportMarkdown}
        onPrint={handlePrint}
        savedCount={savedSessions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error: </span>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Invalid Transcript Notice */}
        {invalidTranscriptNote && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <HelpCircle className="w-5 h-5" />
                <span>Transcript Input Guidance</span>
              </div>
              <p className="leading-relaxed">{invalidTranscriptNote}</p>
              <div className="pt-2 flex items-center gap-2 text-xs text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Tip: You can click any sample lecture card above to see an instant demonstration.</span>
              </div>
            </div>
          </div>
        )}

        {/* Workspace or Input Form */}
        {studyKit ? (
          <StudyKitWorkspace
            studyKit={studyKit}
            onReset={handleNewLecture}
            onOpenAskDrawer={() => setIsAskDrawerOpen(true)}
          />
        ) : (
          <TranscriptInput
            onSubmit={handleSubmitTranscript}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Persistent Audio Player Bar if active */}
      {isAudioActive && studyKit && (
        <AudioPlayerBar
          studyKit={studyKit}
          onClose={() => setIsAudioActive(false)}
        />
      )}

      {/* Ask Grounded Assistant Side Drawer */}
      {studyKit && (
        <AskLectureDrawer
          isOpen={isAskDrawerOpen}
          onClose={() => setIsAskDrawerOpen(false)}
          studyKit={studyKit}
          transcript={currentTranscript}
        />
      )}

      {/* Saved Lectures Modal */}
      <SavedLecturesModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedSessions={savedSessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
}
