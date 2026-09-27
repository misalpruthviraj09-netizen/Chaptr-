import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  Award,
  ChevronRight,
  RotateCcw,
  Check,
  TrendingUp,
  X,
  Crown,
  Compass,
  ScrollText,
  BookOpen,
} from "lucide-react";
import { Pip } from "../brand/Pip";
import { sounds } from "../../utils/sound";

export interface LevelUpCelebrationProps {
  level: number;
  previousLevel?: number;
  xpEarned: number;
  totalXp?: number;
  xpProgress?: {
    currentLevel: number;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
    progressPercent: number;
  };
  onClose?: () => void;
  isInline?: boolean; // If true, renders as high-impact banner/card; if false, modal overlay
}

// Scholar Rank Titles
const getScholarRank = (lvl: number): { title: string; subtitle: string; badgeType: "crown" | "zap" | "scroll" | "compass" | "book" } => {
  if (lvl >= 10) return { title: "Grand Polymath", subtitle: "Universal Wisdom Master", badgeType: "crown" };
  if (lvl >= 7) return { title: "Master Tactician", subtitle: "Deep-Work Strategist", badgeType: "zap" };
  if (lvl >= 5) return { title: "Distinguished Scholar", subtitle: "Dedicated Daily Practitioner", badgeType: "scroll" };
  if (lvl >= 3) return { title: "Curious Apprentice", subtitle: "Building Strong Neural Pathways", badgeType: "compass" };
  return { title: "Novice Reader", subtitle: "Embarking on the Journey of Mastery", badgeType: "book" };
};

const RenderRankBadge: React.FC<{ type: string; className?: string }> = ({ type, className = "" }) => {
  switch (type) {
    case "crown":
      return <Crown size={15} className={`text-amber-500 fill-amber-500 ${className}`} />;
    case "zap":
      return <Zap size={15} className={`text-amber-500 fill-amber-500 ${className}`} />;
    case "scroll":
      return <ScrollText size={15} className={`text-indigo-500 ${className}`} />;
    case "compass":
      return <Compass size={15} className={`text-teal-500 ${className}`} />;
    default:
      return <BookOpen size={15} className={`text-emerald-500 ${className}`} />;
  }
};

// Subtle ambient particle coordinates
const PARTICLES = [
  { x: -75, y: -45, delay: 0.1, size: 14, rotate: -20 },
  { x: 70, y: -50, delay: 0.2, size: 16, rotate: 30 },
  { x: -95, y: 15, delay: 0.15, size: 12, rotate: 15 },
  { x: 90, y: 20, delay: 0.25, size: 15, rotate: -25 },
  { x: -50, y: -80, delay: 0.3, size: 18, rotate: 45 },
  { x: 55, y: -75, delay: 0.18, size: 14, rotate: -15 },
  { x: 0, y: -90, delay: 0.35, size: 16, rotate: 10 },
  { x: -80, y: 65, delay: 0.22, size: 13, rotate: -35 },
  { x: 85, y: 60, delay: 0.28, size: 14, rotate: 40 },
];

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  level,
  previousLevel = Math.max(1, level - 1),
  xpEarned,
  totalXp,
  xpProgress,
  onClose,
  isInline = false,
}) => {
  const [stage, setStage] = useState<"transition" | "celebrate">("transition");
  const [displayedLevel, setDisplayedLevel] = useState(previousLevel);
  const [animationKey, setAnimationKey] = useState(0);

  const rank = getScholarRank(level);
  const progressPercent = xpProgress ? Math.min(100, Math.max(0, xpProgress.progressPercent)) : 25;
  const remainingXp = xpProgress
    ? Math.max(0, xpProgress.xpForNextLevel - xpProgress.xpInCurrentLevel)
    : null;

  // Staged animation sequence
  useEffect(() => {
    setDisplayedLevel(previousLevel);
    setStage("transition");

    const timer1 = setTimeout(() => {
      setDisplayedLevel(level);
      setStage("celebrate");
      try {
        sounds.playLevelUp();
      } catch {
        // sound optional
      }
    }, 700);

    return () => {
      clearTimeout(timer1);
    };
  }, [level, previousLevel, animationKey]);

  const handleReplay = () => {
    setAnimationKey((k) => k + 1);
  };

  const content = (
    <motion.div
      key={`levelup-card-${animationKey}`}
      id="level-up-celebration-card"
      initial={{ opacity: 0, scale: 0.88, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -12 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`relative w-full max-w-md mx-auto overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/90 dark:border-amber-500/30 p-6 sm:p-8 text-center shadow-xl ${
        isInline ? "my-6" : ""
      }`}
    >
      {/* 1. Subtle Radial Amber Glow Aura */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{
          scale: [0.7, 1.25, 1.05],
          opacity: [0, 0.45, 0.22],
        }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute -top-16 -left-16 right-16 bottom-16 rounded-full blur-3xl pointer-events-none bg-[#3730A3]/20"
      />

      {/* 2. Concentric Radiating Rings */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [0.8, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.6, ease: "easeOut", repeat: 1, repeatDelay: 0.3 }}
          className="w-full h-full rounded-full border border-amber-400/40"
        />
        <motion.div
          initial={{ scale: 0.6, opacity: 0.5 }}
          animate={{ scale: [0.6, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.2, repeat: 1, repeatDelay: 0.3 }}
          className="absolute inset-0 rounded-full border border-indigo-400/30"
        />
      </div>

      {/* Floating Sparkle Particles */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: [0, 0.9, 0],
              scale: [0, 1.25, 0.5],
              rotate: [0, p.rotate],
            }}
            transition={{
              duration: 1.5,
              delay: 0.4 + p.delay,
              ease: "easeOut",
            }}
            className="absolute text-amber-500 dark:text-amber-400"
          >
            <Sparkles size={p.size} />
          </motion.div>
        ))}
      </div>

      {/* Close button if modal */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
          aria-label="Dismiss level up notification"
        >
          <X size={18} />
        </button>
      )}

      {/* 3. Hero Visual Section: Animated Shield & Pip */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4"
        >
          <Sparkles size={13} className="text-amber-500 animate-spin-slow" />
          <span>Scholar Elevation</span>
        </motion.div>

        {/* Central Shield Crest with Framer Motion flip & bounce */}
        <div className="relative my-2">
          <motion.div
            animate={
              stage === "celebrate"
                ? {
                    scale: [1, 1.15, 1],
                    rotate: [0, -3, 3, 0],
                  }
                : {}
            }
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#3730A3] p-1 shadow-lg shadow-indigo-900/25 flex items-center justify-center relative"
          >
            <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-2">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Level
              </span>

              {/* Number morph with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayedLevel}
                  initial={{ y: 12, opacity: 0, scale: 0.6 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -12, opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white"
                >
                  {displayedLevel}
                </motion.span>
              </AnimatePresence>

              <div className="mt-0.5">
                <RenderRankBadge type={rank.badgeType} />
              </div>
            </div>
          </motion.div>

          {/* Floating mini XP badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 16 }}
            className="absolute -bottom-2 -right-3 px-2.5 py-0.5 rounded-md bg-[#3730A3] text-white font-display text-[11px] font-bold shadow-md flex items-center gap-1 border-2 border-white dark:border-slate-900"
          >
            <Zap size={11} className="fill-amber-300 text-amber-300" />
            <span>+{xpEarned} XP</span>
          </motion.div>
        </div>

        {/* Mascot & Celebration Title */}
        <div className="mt-4 space-y-1.5">
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
          >
            Level Up!
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-0.5"
          >
            <p className="font-semibold text-sm text-amber-700 dark:text-amber-400">
              Rank: {rank.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {rank.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Mascot cheer */}
        <div className="my-3">
          <Pip
            mood="cheering"
            size="sm"
            speechBubble={`Unstoppable! Welcome to Level ${level}!`}
          />
        </div>

        {/* 4. Animated XP Progress toward next level */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingUp size={13} className="text-indigo-500" />
              <span>Next Threshold: Level {level + 1}</span>
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ delay: 0.6, duration: 1.1, ease: "easeOut" }}
              className="h-full bg-[#3730A3] rounded-full"
            />
          </div>

          <p className="text-[11px] text-slate-400">
            {remainingXp !== null && remainingXp > 0
              ? `${remainingXp} XP needed for Level ${level + 1}`
              : `Keep completing missions to climb to Level ${level + 1}!`}
          </p>
        </div>

        {/* 5. Action Controls */}
        <div className="flex items-center justify-center gap-3 w-full mt-5">
          <button
            id="replay-level-up-btn"
            type="button"
            onClick={handleReplay}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Replay animation"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Replay</span>
          </button>

          {onClose ? (
            <button
              id="confirm-level-up-btn"
              type="button"
              onClick={onClose}
              className="btn-3d flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2"
            >
              <span>Continue Journey</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <div className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
              <Check size={14} className="text-emerald-500" />
              <span>Level {level} Mastered</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div
      id="level-up-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <AnimatePresence>{content}</AnimatePresence>
    </div>
  );
};
