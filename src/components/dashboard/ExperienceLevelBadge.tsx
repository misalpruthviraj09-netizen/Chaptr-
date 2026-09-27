import React, { useState } from "react";
import {
  Zap,
  Award,
  Sparkles,
  Trophy,
  ChevronRight,
  Info,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Crown,
  Compass,
  ScrollText,
} from "lucide-react";

export interface ProgressionData {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  xpNeededForNextLevel: number;
  totalXp?: number;
  cumulativeMissionPoints?: number;
  completedMissionsCount?: number;
}

export interface ExperienceLevelBadgeProps {
  progression: ProgressionData;
  userName?: string;
  className?: string;
}

// Scholar Titles based on user level
const getScholarRankTitle = (level: number): { title: string; subtitle: string; iconType: "crown" | "zap" | "scroll" | "compass" | "book" } => {
  if (level >= 10) {
    return {
      title: "Grand Polymath",
      subtitle: "Master of universal wisdom",
      iconType: "crown",
    };
  }
  if (level >= 7) {
    return {
      title: "Master Tactician",
      subtitle: "Advanced deep-work strategist",
      iconType: "zap",
    };
  }
  if (level >= 5) {
    return {
      title: "Distinguished Scholar",
      subtitle: "Dedicated daily practitioner",
      iconType: "scroll",
    };
  }
  if (level >= 3) {
    return {
      title: "Curious Apprentice",
      subtitle: "Building strong recall neural pathways",
      iconType: "compass",
    };
  }
  return {
    title: "Novice Reader",
    subtitle: "Embarking on the journey of mastery",
    iconType: "book",
  };
};

const RenderRankIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "" }) => {
  switch (type) {
    case "crown":
      return <Crown size={14} className={`text-amber-500 fill-amber-500 ${className}`} />;
    case "zap":
      return <Zap size={14} className={`text-amber-500 fill-amber-500 ${className}`} />;
    case "scroll":
      return <ScrollText size={14} className={`text-indigo-500 ${className}`} />;
    case "compass":
      return <Compass size={14} className={`text-teal-500 ${className}`} />;
    default:
      return <BookOpen size={14} className={`text-emerald-500 ${className}`} />;
  }
};

export const ExperienceLevelBadge: React.FC<ExperienceLevelBadgeProps> = ({
  progression,
  userName,
  className = "",
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const level = progression?.currentLevel || 1;
  const progressPercent = Math.min(100, Math.max(0, progression?.progressPercent || 0));
  const cumulativePoints =
    progression?.cumulativeMissionPoints ?? progression?.totalXp ?? 0;
  const missionsCompleted = progression?.completedMissionsCount ?? 0;
  const rank = getScholarRankTitle(level);

  // SVG Circular Badge geometry
  const size = 76;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      id="experience-level-badge"
      className={`relative bg-white dark:bg-[#131A2E] rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] overflow-hidden transition-all ${className}`}
    >
      {/* Subtle background glow utilizing --color-xp */}
      <div
        className="absolute -top-12 -left-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-15"
        style={{ backgroundColor: "var(--color-xp)" }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        {/* Left: Badge Visual + Level Ring */}
        <div className="flex items-center gap-4">
          {/* Visual Badge with Circular Progress Ring in --color-xp */}
          <div
            className="relative flex items-center justify-center shrink-0"
            style={{ width: size, height: size }}
          >
            {/* Ambient ring glow */}
            <div
              className="absolute inset-0 rounded-full blur-md opacity-35"
              style={{ backgroundColor: "var(--color-xp)" }}
            />

            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 relative z-10"
            >
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth={strokeWidth}
              />
              {/* Progress ring using --color-xp */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--color-xp)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition:
                    "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </svg>

            {/* Core Badge Center: Level number & Shield style with metallic ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none z-20">
              <div
                className="w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-md border-2"
                style={{
                  background: "radial-gradient(circle at 35% 35%, rgba(250, 204, 21, 0.25), rgba(19, 26, 46, 0.85))",
                  borderColor: "var(--color-xp)",
                  boxShadow: "0 0 12px rgba(250, 204, 21, 0.35)",
                }}
              >
                <span className="text-[8px] font-bold tracking-tighter uppercase text-amber-500 dark:text-amber-400 -mb-0.5 leading-none">
                  LVL
                </span>
                <span
                  className="font-display font-extrabold text-xl leading-none drop-shadow-xs"
                  style={{ color: "var(--color-xp)" }}
                >
                  {level}
                </span>
              </div>
            </div>
          </div>

          {/* Level Details & Rank Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border shadow-xs"
                style={{
                  backgroundColor: "rgba(250, 204, 21, 0.15)",
                  borderColor: "var(--color-xp)",
                  color: "#B45309", // High contrast amber text for light mode
                }}
              >
                <Zap
                  size={12}
                  className="fill-current"
                  style={{ color: "var(--color-xp)" }}
                />
                <span className="dark:text-amber-300">Experience Level</span>
              </span>

              <span className="text-xs font-display font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <RenderRankIcon type={rank.iconType} />
                <span>{rank.title}</span>
              </span>
            </div>

            {/* Cumulative Mastery Points Metric */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <span
                className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5"
                title={`${cumulativePoints} cumulative mastery points`}
              >
                <span style={{ color: "var(--color-xp)" }}>{cumulativePoints}</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
                  Mastery XP
                </span>
              </span>

              {missionsCompleted > 0 && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  • {missionsCompleted} {missionsCompleted === 1 ? "mission" : "missions"} completed
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {rank.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Progress to Next Rank & Info Toggle */}
        <div className="w-full sm:w-64 space-y-2 sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Next Rank: Lvl {level + 1}
            </span>
            <span
              className="font-bold font-display"
              style={{ color: "var(--color-xp)" }}
            >
              {progression.xpNeededForNextLevel} XP needed
            </span>
          </div>

          {/* Segmented Progress Bar styled with --color-xp and shimmer animation */}
          <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 shadow-sm shimmer-active"
              style={{
                width: `${Math.max(4, progressPercent)}%`,
                background: "linear-gradient(90deg, #FACC15 0%, #F59E0B 100%)",
                boxShadow: "0 0 10px rgba(250, 204, 21, 0.4)",
              }}
            />
            {/* 5-segment track indicators */}
            <div className="absolute inset-0 grid grid-cols-5 pointer-events-none divide-x divide-white/30 dark:divide-slate-900/60" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>
              {progression.xpInCurrentLevel} / {progression.xpForNextLevel} XP
            </span>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-0.5 transition-colors"
            >
              <span>{showDetails ? "Hide breakdown" : "View breakdown"}</span>
              <ChevronRight
                size={12}
                className={`transform transition-transform ${
                  showDetails ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <BookOpen size={14} className="text-indigo-500" />
              <span>Mission Missions</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              +20 XP awarded upon completing each mission chapter.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <CheckCircle2
                size={14}
                style={{ color: "var(--color-xp)" }}
              />
              <span>Recall Questions</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              +10 XP per correct question + 15 XP perfect score bonus.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <TrendingUp size={14} className="text-teal-500" />
              <span>Level Formula</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Level = floor(√(XP / 100)) + 1. Total XP: {progression.totalXp ?? cumulativePoints}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
