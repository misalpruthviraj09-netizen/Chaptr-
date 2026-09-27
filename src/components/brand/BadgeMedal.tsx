import React from "react";
import {
  Award,
  Sparkles,
  Flame,
  BookOpen,
  Zap,
  Star,
  CheckCircle2,
  Lock,
} from "lucide-react";

export interface BadgeMedalProps {
  badge: {
    key: string;
    name: string;
    description: string;
    tier: string;
    icon?: string;
    isEarned?: boolean;
    earnedAt?: string | null;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

export const BadgeMedal: React.FC<BadgeMedalProps> = ({
  badge,
  size = "md",
  className = "",
  showTooltip = true,
}) => {
  const { name, description, tier, isEarned = true, icon, earnedAt } = badge;

  const sizeMap = {
    sm: { width: 44, height: 44, iconSize: 18, text: "text-xs" },
    md: { width: 68, height: 68, iconSize: 28, text: "text-sm" },
    lg: { width: 92, height: 92, iconSize: 40, text: "text-base" },
  };

  const currentSize = sizeMap[size];
  const uid = `badge-${badge.key}-${tier}-${size}`;

  // Metallic gradient colors by tier
  const tierColors: Record<string, { start: string; mid: string; end: string; ring: string }> = {
    gold: { start: "#FDE047", mid: "#EAB308", end: "#CA8A04", ring: "#FEF08A" },
    silver: { start: "#F1F5F9", mid: "#CBD5E1", end: "#94A3B8", ring: "#FFFFFF" },
    bronze: { start: "#FDBA74", mid: "#EA580C", end: "#9A3412", ring: "#FED7AA" },
  };

  const colors = tierColors[tier.toLowerCase()] || tierColors.bronze;

  // Icon mapping
  const renderCenterIcon = () => {
    if (!isEarned) {
      return <Lock size={currentSize.iconSize} className="text-slate-400 dark:text-slate-500" />;
    }

    const iconColor = tier.toLowerCase() === "silver" ? "text-slate-700" : "text-amber-950";
    switch (icon) {
      case "Sparkles":
        return <Sparkles size={currentSize.iconSize} className={iconColor} />;
      case "Flame":
        return <Flame size={currentSize.iconSize} className={iconColor} />;
      case "BookOpen":
        return <BookOpen size={currentSize.iconSize} className={iconColor} />;
      case "Zap":
        return <Zap size={currentSize.iconSize} className={iconColor} />;
      case "Star":
        return <Star size={currentSize.iconSize} className={iconColor} />;
      case "CheckCircle2":
        return <CheckCircle2 size={currentSize.iconSize} className={iconColor} />;
      default:
        return <Award size={currentSize.iconSize} className={iconColor} />;
    }
  };

  return (
    <div
      className={`group relative inline-flex flex-col items-center select-none ${className}`}
      id={`badge-element-${badge.key}`}
    >
      <div
        className={`relative flex items-center justify-center transition-transform duration-300 ${
          isEarned ? "hover:scale-110 cursor-pointer" : "opacity-60 grayscale"
        }`}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible drop-shadow-md"
        >
          <defs>
            <linearGradient id={`${uid}-metal`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isEarned ? colors.start : "#94A3B8"} />
              <stop offset="50%" stopColor={isEarned ? colors.mid : "#64748B"} />
              <stop offset="100%" stopColor={isEarned ? colors.end : "#475569"} />
            </linearGradient>
            <linearGradient id={`${uid}-ribbon`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>

          {/* Top Hanging Ribbon */}
          <path
            d="M 28 4 L 40 18 L 52 4 L 58 24 L 22 24 Z"
            fill={isEarned ? "url(#" + uid + "-ribbon)" : "#475569"}
          />

          {/* Outer Starburst / Cog Rim */}
          <circle
            cx="40"
            cy="46"
            r="32"
            fill={`url(#${uid}-metal)`}
            stroke={isEarned ? colors.ring : "#64748B"}
            strokeWidth="2"
          />

          {/* Inner Recessed Dish */}
          <circle
            cx="40"
            cy="46"
            r="24"
            fill={isEarned ? colors.start : "#334155"}
            fillOpacity={isEarned ? "0.85" : "0.5"}
            stroke={isEarned ? colors.end : "#1E293B"}
            strokeWidth="1.5"
          />

          {/* Metallic Sheen Crescent */}
          {isEarned && (
            <path
              d="M 24 36 A 20 20 0 0 1 56 36 A 20 20 0 0 0 24 36 Z"
              fill="#FFFFFF"
              fillOpacity="0.4"
            />
          )}
        </svg>

        {/* Center Icon */}
        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {renderCenterIcon()}
        </div>
      </div>

      {/* Optional Tooltip Card on Hover */}
      {showTooltip && (
        <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 min-w-44 px-3 py-2 rounded-xl bg-slate-900 text-white text-center text-xs shadow-xl border border-slate-700">
          <p className="font-semibold text-amber-300 font-display text-sm">{name}</p>
          <p className="text-slate-300 text-[11px] mt-0.5">{description}</p>
          <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="capitalize">{tier} Medal</span>
            <span>{isEarned ? (earnedAt ? "Earned" : "Unlocked") : "Locked"}</span>
          </div>
        </div>
      )}
    </div>
  );
};
