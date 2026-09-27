import React from "react";

export interface BookCoverData {
  title: string;
  author: string;
  coverColor?: string;
  coverPattern?: string;
  category?: string;
}

export interface BookCoverProps {
  book: BookCoverData;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = "md",
  className = "",
}) => {
  const {
    title,
    author,
    coverColor = "#3730A3",
    coverPattern = "waves",
    category,
  } = book;

  const sizeMap = {
    sm: { width: 100, height: 140, titleSize: 10, authorSize: 7, padding: 8 },
    md: { width: 160, height: 228, titleSize: 15, authorSize: 9.5, padding: 14 },
    lg: { width: 230, height: 326, titleSize: 20, authorSize: 13, padding: 18 },
  };

  const currentSize = sizeMap[size];
  const uid = `pattern-${coverPattern}-${title.toLowerCase().replace(/[^a-z0-9]/g, "")}-${size}`;

  // Helper to split title into 2-3 readable lines
  const words = title.split(" ");
  let titleLines: string[] = [];
  if (words.length <= 2) {
    titleLines = [title];
  } else if (words.length <= 4) {
    titleLines = [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
  } else {
    titleLines = [
      words.slice(0, 2).join(" "),
      words.slice(2, 4).join(" "),
      words.slice(4).join(" "),
    ];
  }

  return (
    <div
      className={`relative select-none inline-block drop-shadow-md hover:drop-shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
      style={{ width: currentSize.width, height: currentSize.height }}
      role="img"
      aria-label={`Book cover for ${title} by ${author}`}
    >
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 160 228"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-r-lg rounded-l-sm overflow-hidden"
      >
        <defs>
          {/* Base cover gradient */}
          <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={coverColor} />
            <stop offset="100%" stopColor={darkenColor(coverColor, 25)} />
          </linearGradient>

          {/* Spine 3D gradient highlight */}
          <linearGradient id={`${uid}-spine`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Diagonal Gloss Sheen */}
          <linearGradient id={`${uid}-gloss`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>

          {/* Procedural Pattern Definitions */}
          {coverPattern === "dots" && (
            <pattern id={`${uid}-pat`} width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="2" fill="#FFFFFF" fillOpacity="0.15" />
            </pattern>
          )}

          {coverPattern === "grid" && (
            <pattern id={`${uid}-pat`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" />
            </pattern>
          )}

          {coverPattern === "stripes" && (
            <pattern id={`${uid}-pat`} width="24" height="24" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="24" stroke="#FFFFFF" strokeWidth="4" strokeOpacity="0.12" />
            </pattern>
          )}

          {coverPattern === "rings" && (
            <pattern id={`${uid}-pat`} width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.14" />
              <circle cx="18" cy="18" r="6" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.12" />
            </pattern>
          )}

          {coverPattern === "waves" && (
            <pattern id={`${uid}-pat`} width="40" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 0 10 Q 10 0 20 10 T 40 10"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeOpacity="0.15"
              />
            </pattern>
          )}
        </defs>

        {/* Base Cover Fill */}
        <rect width="160" height="228" rx="4" fill={`url(#${uid}-bg)`} />

        {/* Pattern Overlay */}
        <rect width="160" height="228" fill={`url(#${uid}-pat)`} />

        {/* Subtle decorative geometric framing */}
        <rect
          x="18"
          y="16"
          width="128"
          height="196"
          rx="6"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.25"
        />

        {/* Category badge */}
        {category && (
          <g transform="translate(24, 26)">
            <rect width="60" height="14" rx="4" fill="#000000" fillOpacity="0.3" />
            <text
              x="30"
              y="10"
              fontFamily="Inter, sans-serif"
              fontSize="7"
              fontWeight="600"
              fill="#FFFFFF"
              fillOpacity="0.9"
              textAnchor="middle"
              letterSpacing="0.5"
            >
              {category.toUpperCase()}
            </text>
          </g>
        )}

        {/* Title Lines (Fredoka) */}
        <g transform={`translate(24, ${category ? 72 : 64})`}>
          {titleLines.map((line, idx) => (
            <text
              key={idx}
              x="0"
              y={idx * 21}
              fontFamily="Fredoka, system-ui, sans-serif"
              fontSize="16"
              fontWeight="700"
              fill="#FFFFFF"
              letterSpacing="-0.2"
            >
              {line}
            </text>
          ))}
        </g>

        {/* Decorative Divider */}
        <line
          x1="24"
          y1="150"
          x2="56"
          y2="150"
          stroke="#2DD4BF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Author */}
        <text
          x="24"
          y="174"
          fontFamily="Inter, sans-serif"
          fontSize="10"
          fontWeight="500"
          fill="#FFFFFF"
          fillOpacity="0.85"
        >
          {author}
        </text>

        {/* Chaptr imprint mark */}
        <text
          x="24"
          y="198"
          fontFamily="Fredoka, sans-serif"
          fontSize="8"
          fontWeight="600"
          fill="#FFFFFF"
          fillOpacity="0.5"
          letterSpacing="0.8"
        >
          CHAPTR EDITIONS
        </text>

        {/* Left Book Spine 3D Shadow Overlay */}
        <rect x="0" y="0" width="14" height="228" fill={`url(#${uid}-spine)`} />
        {/* Soft page edges line */}
        <line x1="14" y1="0" x2="14" y2="228" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.2" />
        {/* Full surface gloss sheen */}
        <rect x="0" y="0" width="160" height="228" fill={`url(#${uid}-gloss)`} pointerEvents="none" />
      </svg>
    </div>
  );
};

// Color utility to calculate gradient stop
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
