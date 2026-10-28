import React from 'react';
import { X, Bookmark, Trash2, Calendar, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { SavedLectureSession } from '../types';

interface SavedLecturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSessions: SavedLectureSession[];
  onSelectSession: (session: SavedLectureSession) => void;
  onDeleteSession: (id: string) => void;
}

export const SavedLecturesModal: React.FC<SavedLecturesModalProps> = ({
  isOpen,
  onClose,
  savedSessions,
  onSelectSession,
  onDeleteSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Saved Lecture Kits ({savedSessions.length})
              </h3>
              <p className="text-xs text-zinc-400">
                Your past generated summaries, revision points, flashcards, and exam questions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Sessions */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {savedSessions.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="text-sm">No saved lectures yet.</p>
              <p className="text-xs text-zinc-600">
                Lectures you generate will be automatically saved here for quick revision.
              </p>
            </div>
          ) : (
            savedSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex items-start justify-between gap-4 group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectSession(session);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-zinc-400">
                    <span className="px-2 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                      {session.subject || 'Lecture'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                      <Calendar className="w-3 h-3" />
                      {session.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {session.title}
                  </h4>

                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {session.transcriptPreview}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => {
                      onSelectSession(session);
                      onClose();
                    }}
                    className="p-2 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors flex items-center gap-1"
                    title="Load Lecture"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete saved lecture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
