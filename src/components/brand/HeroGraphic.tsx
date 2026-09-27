import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  Flame,
  Check,
  Brain,
  BookOpen,
  Award,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Pip } from "./Pip";
import { sounds } from "../../utils/sound";

export const HeroGraphic: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(1); // default option 1 selected
  const [showXpCelebration, setShowXpCelebration] = useState(false);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    if (index === 1) {
      setShowXpCelebration(true);
      try {
        sounds.playCorrect();
      } catch {
        // sound optional
      }
      setTimeout(() => setShowXpCelebration(false), 2400);
    } else {
      try {
        sounds.playWrong();
      } catch {
        // sound optional
      }
    }
  };

  return (
    <div
      id="hero-graphic-stage"
      className={`relative w-full max-w-[460px] mx-auto select-none ${className}`}
    >
      {/* 1. Ambient Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] bg-[#3730A3]/15 rounded-3xl blur-3xl pointer-events-none -z-10" />

      {/* 2. Floating Satellite 1: Pip the Mascot */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [0, -8, 0], opacity: 1 }}
        transition={{
          y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.5 },
        }}
        className="absolute -top-12 right-2 sm:right-6 z-30"
      >
        <Pip mood="happy" size="md" speechBubble="Ready for Mission 1?" />
      </motion.div>

      {/* 3. Floating Satellite 2: Streak Badge */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, 6, 0] }}
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          default: { duration: 0.6 },
        }}
        className="absolute -bottom-6 -left-3 sm:-left-6 z-30 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800/80 shadow-lg flex items-center gap-2.5"
      >
        <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 flex items-center justify-center text-orange-500 shadow-xs">
          <Flame size={18} className="fill-current animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white font-display">
              7-Day Streak
            </span>
          </div>
          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold block leading-none">
            Memory Active
          </span>
        </div>
      </motion.div>

      {/* 4. Floating Satellite 3: Spaced Repetition Retention Pill */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, -6, 0] }}
        transition={{
          y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1 },
          default: { duration: 0.6 },
        }}
        className="absolute -top-6 -left-2 sm:-left-6 z-20 hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 shadow-md text-slate-800 dark:text-slate-200"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[11px] font-semibold flex items-center gap-1">
          <Brain size={12} className="text-indigo-500" />
          <span>SM-2: 94% Retention</span>
        </span>
      </motion.div>

      {/* 5. Main Hero Interactive Card Frame */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 overflow-hidden"
      >
        {/* Subtle decorative top header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Mission 1 • 5 min
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono">
            <Zap size={12} className="fill-amber-500 text-amber-500" />
            <span>+20 XP</span>
          </div>
        </div>

        {/* Mission Book & Title Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <BookOpen size={13} />
              <span>Atomic Habits Core</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Step 2 of 3</span>
          </div>

          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
            The 3-Part Habit Loop
          </h3>

          {/* Stepped progress track */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-[#3730A3] rounded-full" />
          </div>
        </div>

        {/* Active Recall Interactive Question Block */}
        <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider mt-0.5">
              Recall
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
              What is the primary neurological function of the "Cue"?
            </p>
          </div>

          {/* Interactive Options */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSelectOption(0)}
              className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${
                selectedOption === 0
                  ? "bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-200 font-medium"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
              }`}
            >
              <span>A. The physical celebration after finishing</span>
              {selectedOption === 0 && <span className="text-[11px] text-rose-500 font-bold">Try again</span>}
            </button>

            <button
              type="button"
              onClick={() => handleSelectOption(1)}
              className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${
                selectedOption === 1
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>B. The trigger that initiates automatic behavior</span>
              </div>
              {selectedOption === 1 && (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check size={12} className="stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Feedback pill with animated celebration */}
        <AnimatePresence>
          {selectedOption === 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span className="font-semibold">Correct! Cues trigger habit loops.</span>
              </div>

              <span className="font-display font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                +15 XP
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Micro prompt to encourage tapping */}
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-medium">
          Interactive preview. Tap an option to test your recall.
        </p>
      </motion.div>

      {/* Floating XP Burst on correct click */}
      <AnimatePresence>
        {showXpCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.1, y: -40 }}
            exit={{ opacity: 0, scale: 0.8, y: -60 }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 px-4 py-2 rounded-xl bg-[#3730A3] text-white font-display font-bold text-lg shadow-2xl flex items-center gap-2 border-2 border-white pointer-events-none"
          >
            <Sparkles size={18} className="animate-spin" />
            <span>Mastery +15 XP!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
