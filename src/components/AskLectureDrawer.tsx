import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageSquare, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { LectureStudyKit } from '../types';

interface AskLectureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studyKit: LectureStudyKit;
  transcript: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AskLectureDrawer: React.FC<AskLectureDrawerProps> = ({
  isOpen,
  onClose,
  studyKit,
  transcript,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello! I'm your Synapse revision assistant for **${
        studyKit.overview?.title || 'this lecture'
      }**. You can ask me to explain any difficult concept, provide additional intuitive analogies, derive equations step-by-step, or test your understanding!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-lecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          transcript,
          studyKitContext: {
            overview: studyKit.overview,
            executiveSummary: studyKit.executiveSummary,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.error || 'Sorry, I encountered an issue answering your question. Please try again.',
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Network error communicating with lecture assistant. Please check your connection.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    'Can you explain the main concept using a simple real-world analogy?',
    'What was the key formula and what are its application limits?',
    'Why did the lecturer emphasize the distinction mentioned?',
    'Create 2 more challenging practice questions for me to solve.',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Ask Lecture Assistant</h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                Grounded in {studyKit.overview?.title || 'current lecture'}
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

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                    : 'bg-zinc-800/90 text-zinc-200 border border-zinc-700/60 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 px-1">
                {msg.role === 'user' ? 'You' : 'Synapse Assistant'}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50 max-w-[70%]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing lecture context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-950/40">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1.5">
              Suggested questions:
            </span>
            <div className="flex flex-col gap-1.5">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs text-indigo-300 hover:text-white bg-zinc-850 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800 transition-colors truncate"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about this lecture..."
            disabled={isLoading}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
