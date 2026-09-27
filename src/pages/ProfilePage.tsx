import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Flame,
  Zap,
  Award,
  Volume2,
  VolumeX,
  Clock,
  LogOut,
  ShieldCheck,
  Sparkles,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { BadgeMedal } from "../components/brand/BadgeMedal";
import { isSoundEnabled, setSoundEnabled } from "../utils/sound";
import { Pip } from "../components/brand/Pip";

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.progress
      .getDashboard()
      .then((res) => {
        setAllBadges(res.allBadges || []);
      })
      .catch((err) => {
        console.error("Failed to load badges:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Card */}
      <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-[#3730A3] text-white flex items-center justify-center font-display font-bold text-2xl shadow-md">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
              <Clock size={14} className="text-slate-400" />
              <span>Timezone: {user?.timezone || "UTC"}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-3d-neutral px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-display font-semibold text-xs flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-5 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
          <span className="text-xs text-slate-500 font-medium">Total XP</span>
          <p className="font-display font-bold text-2xl text-[#FACC15] mt-1 flex items-center justify-center gap-1">
            <Zap size={18} className="fill-current" />
            {user?.xp || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-5 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
          <span className="text-xs text-slate-500 font-medium">Current Level</span>
          <p className="font-display font-bold text-2xl text-indigo-600 dark:text-indigo-400 mt-1">
            Lvl {user?.level || 1}
          </p>
        </div>

        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-5 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
          <span className="text-xs text-slate-500 font-medium">Current Streak</span>
          <p className="font-display font-bold text-2xl text-[#F97316] mt-1 flex items-center justify-center gap-1">
            <Flame size={18} className="fill-current animate-flame-pulse" />
            {user?.currentStreak || 0}d
          </p>
        </div>

        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-5 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
          <span className="text-xs text-slate-500 font-medium">Longest Streak</span>
          <p className="font-display font-bold text-2xl text-slate-700 dark:text-slate-300 mt-1">
            {user?.longestStreak || 0}d
          </p>
        </div>
      </div>

      {/* Settings: Audio & Preferences */}
      <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
          Preferences
        </h3>

        <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Interactive Audio Feedback
            </span>
            <p className="text-xs text-slate-500">
              Synthesized tones for correct answers, mistakes, and level-ups.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              soundOn
                ? "bg-[#3730A3] text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#18223C] text-slate-500"
            }`}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundOn ? "Sound Enabled" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Medal Showcase */}
      <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Medals & Achievements
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unlock Bronze, Silver, and Gold medals by completing milestones.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badge: any) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  badge.isEarned
                    ? "bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 shadow-xs"
                    : "bg-slate-50/30 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 opacity-60"
                }`}
              >
                <BadgeMedal badge={badge} size="md" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {badge.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 capitalize">
                      {badge.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">
                    {badge.description}
                  </p>
                  {badge.isEarned ? (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
                      <Check size={11} />
                      <span>Earned</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
