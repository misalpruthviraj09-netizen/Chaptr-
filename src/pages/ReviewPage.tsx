import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  BrainCircuit,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { api } from "../services/api";
import { Pip } from "../components/brand/Pip";
import { sounds } from "../utils/sound";
import { useAuth } from "../context/AuthContext";

export const ReviewPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [xpGainedSession, setXpGainedSession] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.review
      .getDue()
      .then((res) => {
        setCards(res.cards || []);
      })
      .catch((err) => {
        console.error("Failed to load review cards:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const currentCard = cards[currentIndex];

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentCard || submitting) return;
    setSubmitting(true);

    try {
      if (isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }

      const res = await api.review.answer(currentCard.id, isCorrect);
      if (isCorrect) {
        setXpGainedSession((prev) => prev + res.xpEarned);
      }
      setAnsweredCount((prev) => prev + 1);
      await refreshUser();

      // Advance to next card or finish
      setIsFlipped(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Finished deck
        setCurrentIndex((prev) => prev + 1);
        sounds.playLevelUp();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      console.error("Failed to record review answer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Pip mood="thinking" size="md" />
        <p className="text-sm text-slate-500 font-medium">Checking your spaced repetition deck...</p>
      </div>
    );
  }

  // If initial deck was empty OR user completed all cards
  const isFinished = cards.length === 0 || currentIndex >= cards.length;

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <Pip mood="proud" size="md" speechBubble="All caught up!" />
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
            Deck Clear!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {answeredCount > 0
              ? `You reviewed ${answeredCount} cards and earned +${xpGainedSession} XP. Your spaced repetition schedule is completely up to date.`
              : "No cards are due for review right now. The SM-2 engine will schedule cards here as they approach the forgetting threshold."}
          </p>
        </div>

        {answeredCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-display font-bold text-sm">
            <Zap size={18} className="fill-current" />
            <span>+{xpGainedSession} XP Earned Today</span>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app/books"
            className="btn-3d px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm"
          >
            Explore More Books
          </Link>
          <Link
            to="/app"
            className="btn-3d-neutral px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-display font-semibold text-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const question = currentCard.question;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Spaced Repetition
          </span>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Daily Recall Deck
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="w-28 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1 p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full rounded-full transition-all duration-300 shimmer-active"
              style={{
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
                backgroundColor: "#3730A3",
              }}
            />
          </div>
        </div>
      </div>

      {/* The Flashcard */}
      <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-6 min-h-[360px] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Card meta info */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-[#3730A3] dark:text-indigo-400">
              {question.mission?.book?.title || "Book Recall"}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              <span>Interval: {currentCard.intervalDays}d</span>
            </span>
          </div>

          {/* Prompt */}
          <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h3>

          {/* Back of card (Revealed Answer) */}
          {isFlipped && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Correct Answer
                </span>
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm font-semibold">
                  {question.options[question.correctIndex]}
                </div>
              </div>

              {question.explanation && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {question.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          {!isFlipped ? (
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="btn-3d w-full py-3.5 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white font-display font-bold text-sm"
            >
              Reveal Answer
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleAnswer(false)}
                className="btn-3d-neutral py-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-display font-bold text-sm flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                <span>Forgot (Review Soon)</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleAnswer(true)}
                className="btn-3d-mint py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <CheckCircle size={18} />
                <span>Remembered (+5 XP)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
