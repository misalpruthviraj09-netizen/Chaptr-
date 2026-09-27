import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Sparkles } from "lucide-react";

export interface XpRewardCardProps {
  xpEarned: number;
  totalXp?: number;
  className?: string;
  onClick?: () => void;
}

export const XpRewardCard: React.FC<XpRewardCardProps> = ({
  xpEarned,
  className = "",
  onClick,
}) => {
  const [count, setCount] = useState(0);

  // Smooth number count-up animation
  useEffect(() => {
    let start = 0;
    const end = xpEarned;
    if (end <= 0) {
      setCount(0);
      return;
    }
    const duration = 900; // ms
    const stepTime = Math.max(20, Math.floor(duration / end));
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [xpEarned]);

  return (
    <motion.div
      id="xp-reward-card"
      initial={{ scale: 0.9, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center overflow-hidden cursor-default select-none ${className}`}
    >
      {/* Soft ambient shimmer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 dark:via-amber-400/10 to-transparent pointer-events-none"
      />

      {/* Floating micro spark */}
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], y: [-2, -14], scale: [0.5, 1, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2 }}
        className="absolute top-2 right-3 text-amber-500 pointer-events-none"
      >
        <Sparkles size={13} />
      </motion.div>

      <div className="flex items-center justify-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold">
        <Zap size={13} className="fill-amber-500 text-amber-500" />
        <span>XP Earned</span>
      </div>

      <motion.p
        key={count}
        className="font-display font-bold text-2xl text-amber-900 dark:text-amber-200 mt-0.5 flex items-center justify-center gap-0.5"
      >
        <span>+{count}</span>
      </motion.p>
    </motion.div>
  );
};
