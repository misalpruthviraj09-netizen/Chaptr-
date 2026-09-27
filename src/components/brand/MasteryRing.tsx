import React from "react";

export interface MasteryRingProps {
  score: number; // 0 - 100
  subscores?: {
    understanding: number;
    recall: number;
    application: number;
    retention: number;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export const MasteryRing: React.FC<MasteryRingProps> = ({
  score = 0,
  subscores,
  size = "md",
  className = "",
  showLabel = true,
}) => {
  const sizeMap = {
    sm: { dimension: 64, stroke: 5, fontSize: "text-xs", labelSize: "text-[9px]" },
    md: { dimension: 104, stroke: 7, fontSize: "text-lg", labelSize: "text-xs" },
    lg: { dimension: 148, stroke: 10, fontSize: "text-2xl", labelSize: "text-sm" },
  };

  const currentSize = sizeMap[size];
  const radius = (currentSize.dimension - currentSize.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Determine score color accent from brand palette
  let scoreColor = "#2DD4BF"; // Mint default
  if (clampedScore >= 80) scoreColor = "#22C55E"; // Green mastery
  else if (clampedScore >= 50) scoreColor = "#4F46E5"; // Indigo learning
  else if (clampedScore > 0) scoreColor = "#F97316"; // Orange streak/beginning

  return (
    <div
      className={`inline-flex flex-col items-center select-none ${className}`}
      id={`mastery-ring-${clampedScore}`}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: currentSize.dimension, height: currentSize.dimension }}
      >
        <svg
          width={currentSize.dimension}
          height={currentSize.dimension}
          viewBox={`0 0 ${currentSize.dimension} ${currentSize.dimension}`}
          className="transform -rotate-90 drop-shadow-sm"
        >
          {/* Background track circle */}
          <circle
            cx={currentSize.dimension / 2}
            cy={currentSize.dimension / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={currentSize.stroke}
          />

          {/* Animated progress circle */}
          <circle
            cx={currentSize.dimension / 2}
            cy={currentSize.dimension / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={currentSize.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-display font-bold text-slate-900 dark:text-white leading-none ${currentSize.fontSize}`}>
            {clampedScore}%
          </span>
          {showLabel && size !== "sm" && (
            <span className={`font-medium text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider ${currentSize.labelSize}`}>
              Mastery
            </span>
          )}
        </div>
      </div>

      {/* Optional subscores breakdown pills */}
      {subscores && size === "lg" && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs w-full">
          <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
            <span className="text-slate-500 text-[11px]">Understanding</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{subscores.understanding}%</span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
            <span className="text-slate-500 text-[11px]">Recall</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{subscores.recall}%</span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
            <span className="text-slate-500 text-[11px]">Application</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{subscores.application}%</span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
            <span className="text-slate-500 text-[11px]">Retention</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{subscores.retention}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
