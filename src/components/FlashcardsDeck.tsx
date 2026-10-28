import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Award,
  Layers,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Flashcard } from '../types';

interface FlashcardsDeckProps {
  cards: Flashcard[];
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({ cards: initialCards }) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [needsReviewIds, setNeedsReviewIds] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'all' | 'needsReview'>('all');

  useEffect(() => {
    setCards(initialCards || []);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setNeedsReviewIds(new Set());
  }, [initialCards]);

  const displayedCards = filterMode === 'needsReview'
    ? cards.filter((c) => needsReviewIds.has(c.id) || !masteredIds.has(c.id))
    : cards;

  const currentCard = displayedCards[currentIndex] || displayedCards[0];

  // Confetti on 100% mastery
  useEffect(() => {
    if (cards.length > 0 && masteredIds.size === cards.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [masteredIds, cards.length]);

  const handleNext = () => {
    if (displayedCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % displayedCards.length);
  };

  const handlePrev = () => {
    if (displayedCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + displayedCards.length) % displayedCards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setMasteredIds(new Set());
    setNeedsReviewIds(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
    setFilterMode('all');
  };

  const markMastered = () => {
    if (!currentCard) return;
    const nextMastered = new Set(masteredIds);
    nextMastered.add(currentCard.id);
    const nextNeedsReview = new Set(needsReviewIds);
    nextNeedsReview.delete(currentCard.id);

    setMasteredIds(nextMastered);
    setNeedsReviewIds(nextNeedsReview);
    handleNext();
  };

  const markNeedsReview = () => {
    if (!currentCard) return;
    const nextNeedsReview = new Set(needsReviewIds);
    nextNeedsReview.add(currentCard.id);
    const nextMastered = new Set(masteredIds);
    nextMastered.delete(currentCard.id);

    setNeedsReviewIds(nextNeedsReview);
    setMasteredIds(nextMastered);
    handleNext();
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-zinc-900 rounded-2xl border border-zinc-800">
        No flashcards generated for this lecture.
      </div>
    );
  }

  const isCurrentMastered = currentCard && masteredIds.has(currentCard.id);
  const isCurrentNeedsReview = currentCard && needsReviewIds.has(currentCard.id);
  const masteryPercentage = Math.round((masteredIds.size / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Deck Header & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              Revision Flashcards
              <span className="text-xs font-normal text-zinc-400">
                ({displayedCards.length} cards)
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Active recall drill: flip, test your memory, and master key definitions.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
            title="Reset progress"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Mastered: {masteredIds.size} / {cards.length} cards
          </span>
          <span className="font-mono text-zinc-300">{masteryPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(masteredIds.size / cards.length) * 100}%` }}
          />
          <div
            className="bg-amber-500/80 h-full transition-all duration-300"
            style={{ width: `${(needsReviewIds.size / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="relative h-80 w-full cursor-pointer select-none perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Card Front */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20 font-semibold">
                Card {currentIndex + 1} of {displayedCards.length}
              </span>
              <span className="text-zinc-500 text-xs flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Click to reveal answer
              </span>
            </div>

            <div className="my-auto text-center py-4">
              <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase mb-2 block">
                {currentCard?.topic || 'Concept / Term'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 leading-snug">
                {currentCard?.front}
              </h2>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-850">
              <span>Front (Question / Prompt)</span>
              {isCurrentMastered && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Mastered
                </span>
              )}
              {isCurrentNeedsReview && (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Needs Review
                </span>
              )}
            </div>
          </div>

          {/* Card Back */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-zinc-950 border border-indigo-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl backface-hidden rotate-y-180"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-semibold">
                Answer / Definition
              </span>
              <span className="text-zinc-500 text-xs flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Click to flip back
              </span>
            </div>

            <div className="my-auto py-4 overflow-y-auto max-h-44 text-zinc-100 text-base sm:text-lg leading-relaxed font-sans">
              {currentCard?.back}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <span className="text-indigo-300 font-medium">Verified transcript information</span>
              <span>Back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Self-Assessment Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous / Next buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            title="Previous card (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Flip Card</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            title="Next card (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Self-Rating buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              markNeedsReview();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
          >
            <XCircle className="w-4 h-4 text-amber-400" />
            <span>Still Learning</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              markMastered();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Mastered</span>
          </button>
        </div>
      </div>
    </div>
  );
};
