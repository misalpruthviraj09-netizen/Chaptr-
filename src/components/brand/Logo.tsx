import React from "react";
import { APP_NAME } from "../../config/brand";

export interface LogoProps {
  variant?: "full" | "icon" | "monochrome";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: { icon: 26, text: "text-lg", height: "h-7" },
    md: { icon: 34, text: "text-2xl", height: "h-9" },
    lg: { icon: 46, text: "text-4xl", height: "h-12" },
  };

  const currentSize = sizeMap[size];
  const isMonochrome = variant === "monochrome";

  return (
    <div
      id="brand-logo"
      className={`inline-flex items-center gap-2.5 select-none ${currentSize.height} ${className}`}
      aria-label={`${APP_NAME} logo`}
    >
      {/* SVG Icon: The "C" as an open book with spark */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105"
        role="img"
        aria-labelledby="logo-title"
      >
        <title id="logo-title">{APP_NAME} Mark</title>
        <defs>
          <linearGradient id="logoSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isMonochrome ? "currentColor" : "#FACC15"} />
            <stop offset="100%" stopColor={isMonochrome ? "currentColor" : "#F59E0B"} />
          </linearGradient>
        </defs>

        {/* Rounded book shield background */}
        <rect
          width="40"
          height="40"
          rx="10"
          fill={isMonochrome ? "currentColor" : "#3730A3"}
        />

        {/* Open Book "C" Shape */}
        {/* Left page */}
        <path
          d="M11 12C11 10.8954 11.8954 10 13 10H20V29H13C11.8954 29 11 28.1046 11 27V12Z"
          fill="#FFFFFF"
          fillOpacity={isMonochrome ? "0.9" : "0.95"}
        />
        {/* Right page forming the curve of the "C" */}
        <path
          d="M20 10H26C27.6569 10 29 11.3431 29 13V15.5C29 16.3284 28.3284 17 27.5 17C26.6716 17 26 16.3284 26 15.5V14.5C26 13.6716 25.3284 13 24.5 13H20V26H24.5C25.3284 26 26 25.3284 26 24.5V23.5C26 22.6716 26.6716 22 27.5 22C28.3284 22 29 22.6716 29 23.5V26C29 27.6569 27.6569 29 26 29H20V10Z"
          fill="#FFFFFF"
        />

        {/* Book spine curve */}
        <path
          d="M20 10V29"
          stroke={isMonochrome ? "currentColor" : "#2DD4BF"}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Golden Spark above the right page */}
        <path
          d="M28 7L28.8 8.7L30.5 9.5L28.8 10.3L28 12L27.2 10.3L25.5 9.5L27.2 8.7L28 7Z"
          fill={isMonochrome ? "#FFFFFF" : "url(#logoSparkGrad)"}
        />
      </svg>

      {/* Wordmark typography in Fredoka */}
      {variant !== "icon" && (
        <span
          className={`font-display font-bold tracking-tight leading-none ${currentSize.text} ${
            isMonochrome
              ? "text-current"
              : "text-slate-900 dark:text-white"
          }`}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );
};
