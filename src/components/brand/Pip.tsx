import React from "react";
import { MASCOT_NAME } from "../../config/brand";

export type PipMood = "happy" | "thinking" | "cheering" | "sleepy" | "proud";

export interface PipProps {
  mood?: PipMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  speechBubble?: string;
  animate?: boolean;
}

export const Pip: React.FC<PipProps> = ({
  mood = "happy",
  size = "md",
  className = "",
  speechBubble,
  animate = true,
}) => {
  const sizeMap = {
    sm: { width: 50, height: 60, scale: "w-12 h-14" },
    md: { width: 90, height: 108, scale: "w-24 h-28" },
    lg: { width: 140, height: 168, scale: "w-36 h-44" },
    xl: { width: 200, height: 240, scale: "w-52 h-64" },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      id={`mascot-${MASCOT_NAME.toLowerCase()}-${mood}`}
      className={`relative inline-flex flex-col items-center ${animate ? "animate-pip-bob" : ""} ${className}`}
      aria-label={`${MASCOT_NAME} the mascot (${mood})`}
    >
      {/* Optional Speech Bubble */}
      {speechBubble && (
        <div className="mb-2.5 max-w-xs px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs md:text-sm font-medium text-slate-800 dark:text-slate-100 relative">
          {speechBubble}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-45" />
        </div>
      )}

      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible select-none drop-shadow-md"
        role="img"
      >
        <defs>
          {/* Gentle page paper gradient */}
          <linearGradient id="pipBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          {/* Bookmark ribbon gradient (Mint/Indigo) */}
          <linearGradient id="pipRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3730A3" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
          {/* Cheerful blush */}
          <radialGradient id="pipBlush">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Bookmark ribbon tail peeking out from the bottom corner */}
        <path
          d="M 62 90 L 68 114 L 75 106 L 82 114 L 76 90 Z"
          fill="url(#pipRibbonGrad)"
        />

        {/* Shadow under Pip */}
        <ellipse cx="50" cy="112" rx="34" ry="5" fill="#0F172A" fillOpacity="0.12" />

        {/* Left Arm */}
        {mood === "cheering" ? (
          // Left arm raised high!
          <path
            d="M 22 55 Q 10 32 16 26 Q 22 28 25 48 Z"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
        ) : mood === "thinking" ? (
          // Left arm resting on hip
          <path
            d="M 20 60 Q 10 65 14 74 Q 22 75 22 68 Z"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
        ) : (
          // Normal relaxed arm
          <path
            d="M 20 58 Q 12 70 16 78 Q 22 76 23 66 Z"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
        )}

        {/* Right Arm */}
        {mood === "cheering" ? (
          // Right arm raised high!
          <path
            d="M 78 55 Q 90 32 84 26 Q 78 28 75 48 Z"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
        ) : mood === "thinking" ? (
          // Hand on chin
          <path
            d="M 80 62 Q 88 50 72 44 Q 68 49 74 60 Z"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
        ) : (
          // Normal relaxed arm
          <path
            d="M 80 58 Q 88 70 84 78 Q 78 76 77 66 Z"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
        )}

        {/* Main Body: Rounded Bookmark / Page Character */}
        <rect
          x="20"
          y="15"
          width="60"
          height="82"
          rx="18"
          fill="url(#pipBodyGrad)"
          stroke="#CBD5E1"
          strokeWidth="2.5"
        />

        {/* Turned page corner detail (top right) */}
        <path
          d="M 64 16 L 79 31 L 64 31 Z"
          fill="#E2E8F0"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Gold bookmark ribbon tab on head */}
        <rect x="36" y="8" width="12" height="12" rx="3" fill="#FACC15" />

        {/* Eyes & Expressions based on mood */}
        <g className={animate && mood !== "sleepy" ? "animate-pip-blink" : ""}>
          {mood === "sleepy" ? (
            // Closed / sleeping droopy curved eyes
            <>
              <path d="M 34 50 Q 42 56 46 50" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 54 50 Q 62 56 66 50" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Zzz floating */}
              <text x="70" y="35" fontSize="11" fontWeight="bold" fill="#818CF8">Z</text>
              <text x="78" y="24" fontSize="9" fontWeight="bold" fill="#818CF8">z</text>
            </>
          ) : mood === "proud" ? (
            // Happy closed crescents (^ ^)
            <>
              <path d="M 34 52 Q 41 43 48 52" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 54 52 Q 61 43 68 52" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : mood === "cheering" ? (
            // Sparkly happy open eyes with stars
            <>
              <circle cx="41" cy="48" r="5" fill="#1E293B" />
              <circle cx="43" cy="46" r="1.8" fill="#FFFFFF" />
              <circle cx="61" cy="48" r="5" fill="#1E293B" />
              <circle cx="63" cy="46" r="1.8" fill="#FFFFFF" />
            </>
          ) : mood === "thinking" ? (
            // Looking up and to the right
            <>
              <circle cx="43" cy="46" r="4.5" fill="#1E293B" />
              <circle cx="45" cy="44" r="1.6" fill="#FFFFFF" />
              <circle cx="63" cy="46" r="4.5" fill="#1E293B" />
              <circle cx="65" cy="44" r="1.6" fill="#FFFFFF" />
              {/* One raised eyebrow */}
              <path d="M 37 38 Q 43 35 49 38" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 57 35 Q 63 31 69 35" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Default Happy big curious eyes
            <>
              <circle cx="41" cy="49" r="4.5" fill="#1E293B" />
              <circle cx="42.5" cy="47.5" r="1.6" fill="#FFFFFF" />
              <circle cx="61" cy="49" r="4.5" fill="#1E293B" />
              <circle cx="62.5" cy="47.5" r="1.6" fill="#FFFFFF" />
            </>
          )}
        </g>

        {/* Cheeks Blush */}
        <circle cx="33" cy="56" r="5.5" fill="url(#pipBlush)" />
        <circle cx="69" cy="56" r="5.5" fill="url(#pipBlush)" />

        {/* Mouth */}
        {mood === "cheering" ? (
          // Big excited open smile
          <path
            d="M 43 59 Q 51 72 59 59 Z"
            fill="#EF4444"
            stroke="#1E293B"
            strokeWidth="2"
          />
        ) : mood === "proud" ? (
          // Smug confident smile
          <path
            d="M 43 62 Q 52 70 59 62"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === "sleepy" ? (
          // Small sleepy 'o'
          <circle cx="51" cy="62" r="2.5" fill="#64748B" />
        ) : mood === "thinking" ? (
          // Small sideways mouth
          <path
            d="M 46 64 Q 52 61 57 65"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Happy warm smile
          <path
            d="M 44 60 Q 51 67 58 60"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
};
