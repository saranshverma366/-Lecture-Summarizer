import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square, FastForward, X } from 'lucide-react';
import { SpeechReader } from '../utils/speech';
import { LectureStudyKit } from '../types';

interface AudioPlayerBarProps {
  studyKit: LectureStudyKit;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ studyKit, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [selectedSource, setSelectedSource] = useState<'summary' | 'revision'>('revision');

  const speeds = [0.8, 1.0, 1.25, 1.5];

  const getTextToPlay = () => {
    if (selectedSource === 'summary') {
      const summaryText = Array.isArray(studyKit.executiveSummary)
        ? studyKit.executiveSummary.join('. ')
        : (studyKit.executiveSummary || '');
      return `Lecture Summary for ${studyKit.overview?.title || 'Lecture'}. ${summaryText}`;
    } else {
      const pointsText = studyKit.revisionPoints
        .map((p, i) => `Point ${i + 1}: ${p.point}.`)
        .join(' ');
      return `Quick Revision Points for ${studyKit.overview?.title || 'Lecture'}. ${pointsText}`;
    }
  };

  const handlePlay = () => {
    if (SpeechReader.isPaused()) {
      SpeechReader.resume();
      setIsPlaying(true);
      return;
    }

    const text = getTextToPlay();
    SpeechReader.speak(
      text,
      speed,
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
    setIsPlaying(true);
  };

  const handlePause = () => {
    SpeechReader.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    SpeechReader.stop();
    setIsPlaying(false);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      handleStop();
      setTimeout(() => {
        const text = getTextToPlay();
        SpeechReader.speak(text, newSpeed, () => setIsPlaying(false));
        setIsPlaying(true);
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      SpeechReader.stop();
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl bg-zinc-900/95 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-zinc-200 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Title & Source switch */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-zinc-100 block">
            Audio Revision Player
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <button
              onClick={() => {
                handleStop();
                setSelectedSource('revision');
              }}
              className={`hover:underline ${selectedSource === 'revision' ? 'text-indigo-400 font-semibold' : ''}`}
            >
              Revision Points
            </button>
            <span>•</span>
            <button
              onClick={() => {
                handleStop();
                setSelectedSource('summary');
              }}
              className={`hover:underline ${selectedSource === 'summary' ? 'text-indigo-400 font-semibold' : ''}`}
            >
              Summary
            </button>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-sm"
            title="Pause"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-sm"
            title="Play Audio"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </button>
        )}

        <button
          onClick={handleStop}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          title="Stop"
        >
          <Square className="w-3.5 h-3.5" />
        </button>

        {/* Speed Selector */}
        <div className="flex items-center rounded-lg bg-zinc-800 p-0.5 border border-zinc-700">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-medium transition-colors ${
                speed === s ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            handleStop();
            onClose();
          }}
          className="p-1.5 text-zinc-500 hover:text-zinc-300 ml-1"
          title="Close player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
