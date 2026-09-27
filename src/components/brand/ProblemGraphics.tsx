import React from "react";

export const TsundokuGraphic: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-14 h-12 ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tsBook1" x1="10" y1="50" x2="85" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#3730A3" />
      </linearGradient>
      <linearGradient id="tsBook2" x1="15" y1="32" x2="80" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0D9488" />
        <stop offset="1" stopColor="#0F766E" />
      </linearGradient>
      <linearGradient id="tsBook3" x1="22" y1="14" x2="75" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Shadow beneath stack */}
    <ellipse cx="48" cy="74" rx="38" ry="4" fill="currentColor" fillOpacity="0.12" />

    {/* Bottom Book */}
    <rect x="12" y="52" width="74" height="15" rx="3" fill="url(#tsBook1)" />
    <path d="M12 55H84V64H12V55Z" fill="#F8FAFC" fillOpacity="0.85" />
    <rect x="8" y="50" width="8" height="19" rx="2" fill="#312E81" />

    {/* Middle Book (tilted slightly) */}
    <g transform="rotate(-3 48 40)">
      <rect x="18" y="34" width="66" height="14" rx="3" fill="url(#tsBook2)" />
      <path d="M18 37H82V45H18V37Z" fill="#F8FAFC" fillOpacity="0.85" />
      <rect x="14" y="32" width="7" height="18" rx="2" fill="#115E59" />
    </g>

    {/* Top Book with Bookmark */}
    <g transform="rotate(4 48 20)">
      <rect x="24" y="16" width="56" height="13" rx="2.5" fill="url(#tsBook3)" />
      <path d="M24 19H78V26H24V19Z" fill="#F8FAFC" fillOpacity="0.85" />
      <rect x="20" y="14" width="6" height="17" rx="2" fill="#92400E" />
      {/* Hanging ribbon bookmark */}
      <path d="M60 27V38L64 35L68 38V27H60Z" fill="#EF4444" />
    </g>
  </svg>
);

export const ForgettingCurveGraphic: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-14 h-12 ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="decayGrad" x1="15" y1="20" x2="85" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F43F5E" />
        <stop offset="1" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="reviewGrad" x1="15" y1="20" x2="85" y2="25" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Grid axes */}
    <line x1="12" y1="12" x2="12" y2="68" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="68" x2="90" y2="68" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />

    {/* Area under review curve */}
    <path
      d="M12 20 Q 30 20 40 32 T 65 30 T 90 28 L 90 68 L 12 68 Z"
      fill="#10B981"
      fillOpacity="0.1"
    />

    {/* Steep decay curve without review (dotted/solid drop) */}
    <path
      d="M12 20 C 25 50, 45 62, 88 65"
      stroke="url(#decayGrad)"
      strokeWidth="2.5"
      strokeDasharray="3 3"
      strokeLinecap="round"
    />

    {/* Spaced repetition memory restoration curve */}
    <path
      d="M12 20 Q 30 20 40 32 Q 41 22 55 24 Q 66 28 88 28"
      stroke="url(#reviewGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Memory boost nodes */}
    <circle cx="12" cy="20" r="3.5" fill="#10B981" />
    <circle cx="40" cy="32" r="3" fill="#F59E0B" />
    <circle cx="88" cy="28" r="3.5" fill="#10B981" />
    <circle cx="88" cy="65" r="3" fill="#F43F5E" />
  </svg>
);

export const PassiveSkimmingGraphic: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-14 h-12 ${className}`}
    aria-hidden="true"
  >
    {/* Page outline */}
    <rect x="22" y="10" width="56" height="60" rx="4" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

    {/* Passive lines */}
    <line x1="30" y1="22" x2="68" y2="22" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="30" y1="32" x2="72" y2="32" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="30" y1="42" x2="60" y2="42" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="30" y1="52" x2="66" y2="52" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" />

    {/* Yellow highlighter streak across passive text */}
    <rect x="28" y="29" width="46" height="7" rx="2" fill="#FACC15" fillOpacity="0.5" />

    {/* Floating eye / lens with question mark */}
    <g transform="translate(56, 38)">
      <circle cx="16" cy="16" r="14" fill="#6366F1" />
      <path
        d="M8 16C8 16 11 10 16 10C21 10 24 16 24 16C24 16 21 22 16 22C11 22 8 16 8 16Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="16" cy="16" r="3" fill="#312E81" />
    </g>
  </svg>
);

export const SummariesGraphic: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-14 h-12 ${className}`}
    aria-hidden="true"
  >
    {/* Condensing arrow compressing bulk text */}
    <rect x="14" y="16" width="30" height="48" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
    <line x1="20" y1="26" x2="38" y2="26" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="34" x2="38" y2="34" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="42" x2="34" y2="42" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="50" x2="36" y2="50" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />

    {/* Compression arrows */}
    <path d="M48 40H60M60 40L55 35M60 40L55 45" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Compressed bullet card missing active quiz */}
    <rect x="66" y="24" width="22" height="32" rx="3" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.5" />
    <line x1="71" y1="32" x2="83" y2="32" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="71" y1="38" x2="81" y2="38" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />

    {/* Missing interactive puzzle marker */}
    <circle cx="84" cy="46" r="6" fill="#EF4444" />
    <line x1="81.5" y1="46" x2="86.5" y2="46" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ZeroAccountabilityGraphic: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-14 h-12 ${className}`}
    aria-hidden="true"
  >
    {/* Calendar grid with cracked / broken chain */}
    <rect x="18" y="14" width="64" height="52" rx="6" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
    <rect x="18" y="14" width="64" height="14" rx="6" fill="#64748B" fillOpacity="0.2" />

    {/* Calendar rings */}
    <rect x="32" y="10" width="4" height="8" rx="2" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
    <rect x="64" y="10" width="4" height="8" rx="2" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />

    {/* Streak dots fading out */}
    <circle cx="30" cy="38" r="4" fill="#10B981" />
    <circle cx="42" cy="38" r="4" fill="#10B981" />
    <circle cx="54" cy="38" r="4" fill="#F59E0B" />
    <circle cx="66" cy="38" r="4" fill="#EF4444" stroke="#EF4444" strokeWidth="1" fillOpacity="0.3" strokeDasharray="2 2" />

    {/* Slumping flame or broken line */}
    <path
      d="M30 54 H 52 Q 58 54 62 60 L 70 60"
      stroke="#EF4444"
      strokeWidth="2"
      strokeDasharray="2 3"
      strokeLinecap="round"
    />
    <circle cx="70" cy="60" r="3" fill="#EF4444" />
  </svg>
);
