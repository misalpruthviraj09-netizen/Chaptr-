import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Settings2,
  CheckCircle2,
  Flame,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  X,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Pip } from "../brand/Pip";

export type DailyGoalType = "missions" | "minutes";

export interface DailyGoalConfig {
  type: DailyGoalType;
  target: number;
}

export interface DailyGoalProps {
  todayStats?: {
    date: string;
    missionsCount: number;
    minutesRead: number;
    xpEarned: number;
  };
  userId?: string;
  nextMissionId?: string;
  className?: string;
}

const DEFAULT_GOAL: DailyGoalConfig = {
  type: "missions",
  target: 2,
};

export const DailyGoal: React.FC<DailyGoalProps> = ({
  todayStats = {
    date: "",
    missionsCount: 0,
    minutesRead: 0,
    xpEarned: 0,
  },
  userId = "default",
  nextMissionId,
  className = "",
}) => {
  const storageKey = `chaptr_daily_goal_${userId}`;

  // Load saved goal config or fallback
  const [goal, setGoal] = useState<DailyGoalConfig>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.type && typeof parsed.target === "number") {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_GOAL;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempType, setTempType] = useState<DailyGoalType>(goal.type);
  const [tempTarget, setTempTarget] = useState<number>(goal.target);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Synchronize state if user switches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.type && typeof parsed.target === "number") {
          setGoal(parsed);
          setTempType(parsed.type);
          setTempTarget(parsed.target);
        }
      }
    } catch {
      // ignore
    }
  }, [userId, storageKey]);

  // Current metric value based on active goal type
  const currentValue =
    goal.type === "missions"
      ? todayStats.missionsCount
      : todayStats.minutesRead;

  const targetValue = Math.max(1, goal.target);
  const percentComplete = Math.min(100, Math.round((currentValue / targetValue) * 100));
  const isGoalAchieved = currentValue >= targetValue;
  const remainingValue = Math.max(0, targetValue - currentValue);

  // Trigger celebration once when goal is hit
  useEffect(() => {
    if (isGoalAchieved && !hasCelebrated && currentValue > 0) {
      setHasCelebrated(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }
  }, [isGoalAchieved, hasCelebrated, currentValue]);

  // Save changes
  const handleSaveGoal = () => {
    const newConfig: DailyGoalConfig = {
      type: tempType,
      target: Math.max(1, tempTarget),
    };
    setGoal(newConfig);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    setIsEditing(false);
  };

  const handleOpenEdit = () => {
    setTempType(goal.type);
    setTempTarget(goal.target);
    setIsEditing(true);
  };

  // SVG Progress Ring calculations
  const dimension = 96;
  const strokeWidth = 8;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  // Presets for quick selection
  const missionPresets = [
    { label: "Casual", count: 1, desc: "5 min" },
    { label: "Regular", count: 2, desc: "10 min" },
    { label: "Serious", count: 3, desc: "15 min" },
    { label: "Scholar", count: 5, desc: "25 min" },
  ];

  const minutePresets = [
    { label: "Brisk", count: 5, desc: "1 mission" },
    { label: "Standard", count: 10, desc: "2 missions" },
    { label: "Deep", count: 20, desc: "4 missions" },
    { label: "Mastery", count: 30, desc: "6 missions" },
  ];

  return (
    <div
      id="daily-goal-card"
      className={`bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden transition-all ${className}`}
    >
      {/* Background ambient gradient accent if achieved */}
      {isGoalAchieved && (
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#22C55E]/15 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Header with Title and Edit Goal button */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Daily Commitment
              </span>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                Daily Goal
              </h3>
            </div>
          </div>

          <button
            type="button"
            id="edit-daily-goal-button"
            onClick={handleOpenEdit}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Configure your daily target"
          >
            <Settings2 size={14} />
            <span className="hidden sm:inline">Change</span>
          </button>
        </div>

        {/* Progress Ring and Metrics Row */}
        <div className="pt-4 flex items-center gap-5">
          {/* Visual Progress Ring */}
          <div className="relative shrink-0 flex items-center justify-center" style={{ width: dimension, height: dimension }}>
            <svg
              width={dimension}
              height={dimension}
              viewBox={`0 0 ${dimension} ${dimension}`}
              className="transform -rotate-90"
            >
              {/* Background ring */}
              <circle
                cx={dimension / 2}
                cy={dimension / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth={strokeWidth}
              />

              {/* Foreground animated progress */}
              <circle
                cx={dimension / 2}
                cy={dimension / 2}
                r={radius}
                fill="none"
                stroke={isGoalAchieved ? "#22C55E" : "#4F46E5"}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease",
                }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              {isGoalAchieved ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 size={24} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-display mt-0.5">
                    100%
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="font-display font-bold text-lg text-slate-900 dark:text-white leading-none">
                    {percentComplete}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                    {currentValue}/{targetValue}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Goal Description & Live Status */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {goal.type === "missions" ? (
                  <>
                    {currentValue} of {targetValue} {targetValue === 1 ? "mission" : "missions"}
                  </>
                ) : (
                  <>
                    {currentValue} of {targetValue} minutes read
                  </>
                )}
              </span>
              {isGoalAchieved && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                  <Sparkles size={10} /> Met
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isGoalAchieved ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Fantastic! You crushed today's learning commitment.
                </span>
              ) : remainingValue === 1 ? (
                goal.type === "missions" ? (
                  "Just 1 more mission left to complete your goal today."
                ) : (
                  `Just ${remainingValue} minute left to hit your goal.`
                )
              ) : (
                goal.type === "missions" ? (
                  `${remainingValue} missions remaining to hit today's target.`
                ) : (
                  `${remainingValue} minutes of reading needed today.`
                )
              )}
            </p>

            {/* Secondary stat chip */}
            <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <BookOpen size={12} className="text-indigo-500" />
                <span>{todayStats.missionsCount} {todayStats.missionsCount === 1 ? "mission" : "missions"}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-teal-500" />
                <span>{todayStats.minutesRead}m reading</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Target: {targetValue} {goal.type === "missions" ? "missions" : "min"} / day
        </span>

        {!isGoalAchieved && nextMissionId ? (
          <Link
            to={`/app/missions/${nextMissionId}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 group"
          >
            <span>Continue Mission</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            to="/app/books"
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1"
          >
            <span>{isGoalAchieved ? "Read Extra" : "Explore Books"} &gt;</span>
          </Link>
        )}
      </div>

      {/* Goal Configuration Modal / Drawer */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 max-w-sm w-full border border-slate-200/90 dark:border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Set Your Daily Target
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Target Mode Segmented Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Track by
              </label>
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setTempType("missions");
                    if (tempType !== "missions") setTempTarget(2);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tempType === "missions"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Missions Completed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempType("minutes");
                    if (tempType !== "minutes") setTempTarget(10);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tempType === "minutes"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Reading Minutes
                </button>
              </div>
            </div>

            {/* Target Value Stepper */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Daily Goal
              </label>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() =>
                    setTempTarget((prev) =>
                      tempType === "missions"
                        ? Math.max(1, prev - 1)
                        : Math.max(5, prev - 5)
                    )
                  }
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-600 hover:bg-slate-100 active:scale-95"
                >
                  <Minus size={16} />
                </button>

                <div className="text-center">
                  <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                    {tempTarget}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5">
                    {tempType === "missions"
                      ? tempTarget === 1
                        ? "mission"
                        : "missions"
                      : "minutes"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setTempTarget((prev) =>
                      tempType === "missions"
                        ? Math.min(10, prev + 1)
                        : Math.min(60, prev + 5)
                    )
                  }
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-600 hover:bg-slate-100 active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(tempType === "missions" ? missionPresets : minutePresets).map(
                  (preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setTempTarget(preset.count)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        tempTarget === preset.count
                          ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs">{preset.label}</div>
                      <div className="text-[10px] text-slate-500">
                        {preset.count} {tempType === "missions" ? "missions" : "min"} ({preset.desc})
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-3d-neutral px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                id="save-daily-goal-button"
                onClick={handleSaveGoal}
                className="btn-3d px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-xs"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
