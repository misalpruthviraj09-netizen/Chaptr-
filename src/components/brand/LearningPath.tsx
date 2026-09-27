import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, Play } from "lucide-react";
import { Pip } from "./Pip";

export interface PathMissionNode {
  id: string;
  order: number;
  title: string;
  summary?: string;
  estimatedMinutes?: number;
  status: "COMPLETED" | "UNLOCKED" | "LOCKED";
  bestScore?: number;
}

export interface LearningPathProps {
  missions: PathMissionNode[];
  onSelectMission?: (mission: PathMissionNode) => void;
  className?: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  missions,
  onSelectMission,
  className = "",
}) => {
  const navigate = useNavigate();

  // Find the first UNLOCKED mission (the "current" active mission)
  const completedCount = missions.filter((m) => m.status === "COMPLETED").length;
  const currentMissionIndex = missions.findIndex((m) => m.status === "UNLOCKED");
  const activeIndex =
    currentMissionIndex >= 0
      ? currentMissionIndex
      : completedCount === missions.length && missions.length > 0
      ? missions.length - 1
      : 0;

  const handleNodeClick = (mission: PathMissionNode) => {
    if (mission.status === "LOCKED") return;
    if (onSelectMission) {
      onSelectMission(mission);
    } else if (mission.id) {
      navigate(`/app/missions/${mission.id}`);
    }
  };

  // Zigzag alignment pattern for nodes: center, left, center, right...
  const getOffsetClass = (index: number) => {
    const pattern = ["justify-center", "justify-start pl-4 sm:pl-12", "justify-center", "justify-end pr-4 sm:pr-12"];
    return pattern[index % pattern.length];
  };

  return (
    <div className={`relative max-w-xl mx-auto py-8 ${className}`} id="learning-path-container">
      {/* Curved vertical connecting track */}
      <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 -z-10 opacity-70" />
      <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-white/60 dark:border-white/20 -z-10" />

      <div className="flex flex-col gap-10 sm:gap-14">
        {missions.map((mission, idx) => {
          const isCompleted = mission.status === "COMPLETED";
          const isCurrent = idx === activeIndex && mission.status !== "LOCKED";
          const isLocked = mission.status === "LOCKED";

          return (
            <div key={mission.id} className={`flex items-center ${getOffsetClass(idx)} relative`}>
              {/* Mission Node Container */}
              <div className="relative group flex flex-col items-center">
                {/* Mascot standing on current node! */}
                {isCurrent && (
                  <div
                    onClick={() => handleNodeClick(mission)}
                    className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 cursor-pointer active:scale-95 transition-transform"
                    title="Click to start mission"
                  >
                    <Pip mood="cheering" size="sm" speechBubble="Start here!" />
                  </div>
                )}

                <button
                  type="button"
                  id={`mission-node-btn-${mission.order}`}
                  disabled={isLocked}
                  onClick={() => handleNodeClick(mission)}
                  className={`relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl transition-all duration-200 shadow-md select-none touch-manipulation ${
                    isCompleted
                      ? "bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white cursor-pointer ring-4 ring-emerald-100 dark:ring-emerald-950/60"
                      : isCurrent
                      ? "bg-[#3730A3] hover:bg-[#312E81] active:scale-95 text-white cursor-pointer ring-4 ring-indigo-200 dark:ring-indigo-900 animate-pulse"
                      : !isLocked
                      ? "bg-[#3730A3] hover:bg-[#312E81] active:scale-95 text-white cursor-pointer ring-4 ring-indigo-100"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  }`}
                  aria-label={`Mission ${mission.order}: ${mission.title} (${mission.status.toLowerCase()})`}
                >
                  {isCompleted ? (
                    <Check size={28} className="stroke-[3]" />
                  ) : !isLocked ? (
                    <Play size={26} className="fill-current translate-x-0.5" />
                  ) : (
                    <Lock size={22} />
                  )}

                  {/* Order badge */}
                  <span
                    className={`absolute -bottom-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                      isCompleted
                        ? "bg-emerald-700 text-emerald-100"
                        : !isLocked
                        ? "bg-[#3730A3] text-indigo-100"
                        : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    M{mission.order}
                  </span>
                </button>

                {/* Popover / Title banner */}
                <div
                  onClick={() => handleNodeClick(mission)}
                  className={`mt-3 text-center max-w-[170px] sm:max-w-[200px] select-none ${
                    isLocked ? "opacity-60" : "opacity-100 cursor-pointer active:opacity-80"
                  }`}
                >
                  <p className="font-display font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {mission.title}
                  </p>
                  {mission.estimatedMinutes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {mission.estimatedMinutes} min
                      {isCompleted && mission.bestScore ? ` • Best ${mission.bestScore}%` : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
