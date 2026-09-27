import React, { useState, useEffect } from "react";
import { Trophy, Zap, Crown, RotateCcw, CheckCircle2, Flame, Sparkles, Users } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Pip } from "../components/brand/Pip";

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"weekly" | "all">("weekly");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const fetchLeaderboard = (selectedPeriod = period) => {
    setLoading(true);
    return api.leaderboard
      .get(selectedPeriod)
      .then((res) => {
        setLeaderboard(res.leaderboard || []);
        setCurrentUserRank(res.currentUserRank || null);
      })
      .catch((err) => {
        console.error("Failed to load leaderboard:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period]);

  const handleResetLeaderboard = async () => {
    setIsResetting(true);
    setResetNotice(null);
    try {
      const res = await api.leaderboard.reset();
      await fetchLeaderboard(period);
      setResetNotice(res.message || "Leaderboard refreshed successfully with active community scholars.");
      setTimeout(() => {
        setResetNotice(null);
      }, 5000);
    } catch (err: any) {
      console.error("Failed to reset leaderboard:", err);
      setResetNotice(err.message || "Failed to reset leaderboard. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const myRank = currentUserRank?.rank || (user ? leaderboard.findIndex((e) => e.id === user.id) + 1 : null);
  const myXp = currentUserRank?.xp ?? (user ? (period === "all" ? user.xp : 0) : 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy size={28} className="text-amber-500" />
            <span>Community Leaderboard</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare XP earned with fellow scholars across the platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Reset Leaderboard Button */}
          <button
            type="button"
            onClick={handleResetLeaderboard}
            disabled={isResetting || loading}
            title="Reset & refresh leaderboard standings"
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
          >
            <RotateCcw size={14} className={isResetting ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""} />
            <span>{isResetting ? "Resetting..." : "Reset Leaderboard"}</span>
          </button>

          {/* Period Toggle */}
          <div className="flex bg-slate-100 dark:bg-[#18223C] p-1 rounded-2xl border border-slate-200/90 dark:border-white/10">
            <button
              type="button"
              onClick={() => setPeriod("weekly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                period === "weekly"
                  ? "bg-white dark:bg-[#131A2E] text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Weekly XP
            </button>
            <button
              type="button"
              onClick={() => setPeriod("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                period === "all"
                  ? "bg-white dark:bg-[#131A2E] text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All-Time XP
            </button>
          </div>
        </div>
      </div>

      {/* Reset Notification Banner */}
      {resetNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{resetNotice}</span>
        </div>
      )}

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-4 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ranked Scholars</div>
            <div className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {leaderboard.length} Scholars
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-4 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Crown size={20} />
          </div>
          <div className="truncate">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Leader ({period === "weekly" ? "Weekly" : "All-Time"})</div>
            <div className="text-lg font-display font-bold text-slate-900 dark:text-white truncate">
              {topThree[0]?.name || "None yet"} ({topThree[0]?.xp || 0} XP)
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-4 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap size={20} className="fill-current" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Standing</div>
            <div className="text-lg font-display font-bold text-indigo-600 dark:text-indigo-400">
              {myRank ? `#${myRank} (${myXp} XP)` : "Unranked"}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-48 bg-slate-200 dark:bg-[#131A2E] rounded-3xl" />
          <div className="h-64 bg-slate-200 dark:bg-[#131A2E] rounded-3xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4 max-w-2xl mx-auto text-center">
              {/* 2nd Place */}
              <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] flex flex-col items-center space-y-2 order-1">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-display font-bold text-lg text-slate-700 dark:text-slate-200 border-2 border-slate-300">
                    {(topThree[1].name?.[0] || "S").toUpperCase()}
                  </div>
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-md bg-slate-300 text-slate-800 font-bold text-[10px]">
                    #2
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-full">
                  {topThree[1].name}
                </h4>
                <div className="text-[#FACC15] font-bold text-xs flex items-center gap-1">
                  <Zap size={12} className="fill-current" />
                  <span>{topThree[1].xp} XP</span>
                </div>
              </div>

              {/* 1st Place (Center / Taller) */}
              <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-4 sm:p-8 border-2 border-[#FACC15] shadow-[0_0_25px_rgba(250,204,21,0.25)] flex flex-col items-center space-y-3 order-2 -translate-y-4">
                <Crown size={28} className="text-[#FACC15] fill-[#FACC15]" />
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center font-display font-bold text-2xl text-amber-900 dark:text-amber-200 border-4 border-[#FACC15] shadow-md">
                    {(topThree[0].name?.[0] || "S").toUpperCase()}
                  </div>
                  <span className="absolute -top-2 -right-1 px-2 py-0.5 rounded-md bg-[#FACC15] text-amber-950 font-bold text-xs shadow-xs">
                    #1
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-full">
                  {topThree[0].name}
                </h4>
                <div className="text-[#FACC15] font-bold text-sm flex items-center gap-1">
                  <Zap size={14} className="fill-current" />
                  <span>{topThree[0].xp} XP</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] flex flex-col items-center space-y-2 order-3">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center font-display font-bold text-lg text-amber-800 dark:text-amber-300 border-2 border-amber-600/40">
                    {(topThree[2].name?.[0] || "S").toUpperCase()}
                  </div>
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[10px]">
                    #3
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-full">
                  {topThree[2].name}
                </h4>
                <div className="text-[#FACC15] font-bold text-xs flex items-center gap-1">
                  <Zap size={12} className="fill-current" />
                  <span>{topThree[2].xp} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Ranked Table */}
          <div className="bg-white dark:bg-[#131A2E] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                All Standings ({period === "weekly" ? "Weekly Activity" : "All-Time XP"})
              </h3>
              <span className="text-xs text-slate-500">Updated in real-time</span>
            </div>

            {leaderboard.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Pip mood="happy" size="md" className="mx-auto" />
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  No scholars on the board yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the Reset Leaderboard button above to load active community scholars.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {leaderboard.map((entry) => {
                  const isCurrent = user?.id === entry.id || entry.isCurrentUser;
                  return (
                    <div
                      key={entry.id}
                      className={`px-4 sm:px-6 py-4 flex items-center justify-between transition-colors ${
                        isCurrent
                          ? "bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 text-center font-display font-bold text-sm text-slate-400">
                          {entry.rank === 1 ? (
                            <span className="text-amber-500 font-bold">🥇</span>
                          ) : entry.rank === 2 ? (
                            <span className="text-slate-400 font-bold">🥈</span>
                          ) : entry.rank === 3 ? (
                            <span className="text-amber-600 font-bold">🥉</span>
                          ) : (
                            `#${entry.rank}`
                          )}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-display font-bold text-sm">
                          {(entry.name?.[0] || "S").toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-display font-semibold text-slate-900 dark:text-white">
                              {entry.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Level {entry.level || 1} • {entry.currentStreak || 0}d streak
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1 justify-end">
                          <Zap size={14} className="text-amber-500 fill-current" />
                          {entry.xp} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Persistent user ranking if outside top list */}
          {currentUserRank && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  Your Current Rank: #{currentUserRank.rank}
                </span>
                <span className="text-xs text-slate-500">({currentUserRank.xp} XP)</span>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Complete missions to climb higher!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
