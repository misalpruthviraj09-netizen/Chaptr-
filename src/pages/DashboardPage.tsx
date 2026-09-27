import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  Zap,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Award,
  Play,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Pip } from "../components/brand/Pip";
import { BookCover } from "../components/brand/BookCover";
import { MasteryRing } from "../components/brand/MasteryRing";
import { BadgeMedal } from "../components/brand/BadgeMedal";
import { DailyGoal } from "../components/dashboard/DailyGoal";
import { ExperienceLevelBadge } from "../components/dashboard/ExperienceLevelBadge";
import { ReadingMasteryWidget } from "../components/dashboard/ReadingMasteryWidget";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.progress
      .getDashboard()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load dashboard.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl lg:col-span-2" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Pip mood="thinking" size="md" />
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
          Could not load your dashboard
        </h2>
        <p className="text-sm text-slate-500">{error || "Please refresh the page."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-3d px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-display text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { progression, streakCalendar, dueReviewCount, booksInProgress, allBooksWithMastery, recentBadges } = data;

  // Find the primary book to continue learning
  const currentBook = booksInProgress.find((b: any) => b.nextMission) || allBooksWithMastery[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. EXPERIENCE LEVEL BADGE & STREAK TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Experience Level Badge tracking cumulative mastery points using --color-xp */}
        <div className="lg:col-span-7 flex">
          <ExperienceLevelBadge
            progression={progression}
            userName={user?.name}
            className="w-full flex flex-col justify-between"
          />
        </div>

        {/* 7-Day Streak Calendar Strip */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131A2E] rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame
                size={22}
                className="text-[#F97316] fill-current animate-flame-pulse"
                style={{
                  filter: `drop-shadow(0 0 ${Math.min(14, 4 + (user?.currentStreak || 1))}px rgba(249, 115, 22, 0.75))`,
                }}
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
                  Consistency
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-none">
                  {user?.currentStreak} Day Streak
                </h3>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-[#18223C] px-2.5 py-1 rounded-md">
              Best: {user?.longestStreak} days
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Study at least 1 mission or review card daily to keep your learning momentum alive.
          </p>

          {/* 7-day strip */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
            {streakCalendar.map((day: any) => (
              <div
                key={day.date}
                className={`flex flex-col items-center justify-center py-2 rounded-xl border text-center transition-colors ${
                  day.active
                    ? "bg-orange-50 dark:bg-[#F97316]/10 border-orange-200 dark:border-[#F97316]/30 text-[#F97316] font-bold"
                    : day.isToday
                    ? "bg-slate-100 dark:bg-[#18223C] border-indigo-400 text-slate-800 dark:text-slate-200 font-bold"
                    : "bg-slate-50 dark:bg-[#18223C]/40 border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                <span className="text-[10px] uppercase font-semibold">{day.dayName}</span>
                <div className="mt-1">
                  {day.active ? (
                    <Flame
                      size={16}
                      className="fill-current text-[#F97316] animate-flame-pulse"
                      style={{
                        filter: `drop-shadow(0 0 ${Math.min(10, 3 + (user?.currentStreak || 1))}px rgba(249, 115, 22, 0.6))`,
                      }}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ACTIONS ROW: DAILY GOAL + CONTINUE MISSION + DUE REVIEWS CALLOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Daily Goal Card */}
        <div className="md:col-span-2 lg:col-span-4 flex">
          <DailyGoal
            todayStats={data.todayStats}
            userId={user?.id}
            nextMissionId={currentBook?.nextMission?.id}
            className="w-full"
          />
        </div>

        {/* Continue Learning Card */}
        <div className="md:col-span-1 lg:col-span-5 bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Continue Mission
            </span>
            {currentBook ? (
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="shrink-0">
                  <BookCover book={currentBook} size="sm" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentBook.author} • {currentBook.completedMissions} of {currentBook.totalMissions} missions completed
                  </span>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    {currentBook.title}
                  </h3>
                  {currentBook.nextMission ? (
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200">
                      <p className="font-semibold">Next: Mission {currentBook.nextMission.order}: {currentBook.nextMission.title}</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{currentBook.nextMission.estimatedMinutes} minutes</p>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>All missions in this book completed. Practice with reviews.</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500">Pick a book from the library to start your first mission!</p>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/app/books"
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Browse Library &gt;
            </Link>
            {currentBook?.nextMission ? (
              <Link
                to={`/app/missions/${currentBook.nextMission.id}`}
                className="btn-3d px-6 py-2.5 rounded-xl font-display font-bold text-sm flex items-center gap-2"
              >
                <span>Start Mission {currentBook.nextMission.order}</span>
                <Play size={16} className="fill-current" />
              </Link>
            ) : (
              <Link
                to={`/app/books/${currentBook?.slug || ""}`}
                className="btn-3d-neutral px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-display font-semibold text-sm"
              >
                View Book Path
              </Link>
            )}
          </div>
        </div>

        {/* Spaced Repetition Due Card */}
        <div className="md:col-span-1 lg:col-span-3 bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Spaced Repetition
              </span>
              <BrainCircuit size={18} className="text-teal-500" />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-display font-bold text-2xl text-teal-600 dark:text-teal-400">
                {dueReviewCount}
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Cards Due Now
                </h4>
                <p className="text-xs text-slate-500">Scheduled by SM-2 for memory consolidation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Earn +5 XP per correct recall. Daily 3-minute review moves book insights into permanent memory.
            </p>
          </div>

          <Link
            to="/app/review"
            className={`btn-3d w-full py-3 rounded-xl text-center font-display font-bold text-sm block ${
              dueReviewCount > 0
                ? "btn-3d-mint bg-teal-500 hover:bg-teal-600 text-white"
                : "btn-3d-neutral bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {dueReviewCount > 0 ? `Review ${dueReviewCount} Cards (+5 XP each)` : "Review Deck (Up to date)"}
          </Link>
        </div>
      </div>

      {/* 3. READING MASTERY 30-DAY PROGRESS WIDGET (RECHARTS) */}
      <ReadingMasteryWidget
        data={data.readingMastery}
        nextMissionId={currentBook?.nextMission?.id}
      />

      {/* 4. BOOK MASTERY SCORES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Book Mastery Scores
          </h2>
          <span className="text-xs text-slate-500">Based on active recall, retention & scenarios</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBooksWithMastery.map((book: any) => (
            <div
              key={book.id}
              className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-4 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex gap-4 items-start">
                <BookCover book={book} size="sm" />
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-bold text-[#2DD4BF] uppercase tracking-wider">
                    {book.category}
                  </span>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {book.title}
                  </h4>
                  <p className="text-xs text-slate-500">{book.author}</p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    {book.completedMissions}/{book.totalMissions} missions completed ({book.progressPercent}%)
                  </p>
                </div>
              </div>

              {/* Mastery breakdown */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <div>Understand: <strong className="text-slate-800 dark:text-slate-200">{book.mastery.understanding}%</strong></div>
                  <div>Recall: <strong className="text-slate-800 dark:text-slate-200">{book.mastery.recall}%</strong></div>
                  <div>Apply: <strong className="text-slate-800 dark:text-slate-200">{book.mastery.application}%</strong></div>
                  <div>Retain: <strong className="text-slate-800 dark:text-slate-200">{book.mastery.retention}%</strong></div>
                </div>
                <MasteryRing score={book.mastery.mastery} size="sm" showLabel={false} />
              </div>

              <Link
                to={`/app/books/${book.slug}`}
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-[0.99] transition-all block"
              >
                Open Path &gt;
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECENT BADGES */}
      {recentBadges && recentBadges.length > 0 && (
        <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Recent Medals Earned
            </h3>
            <Link to="/app/profile" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All Badges
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            {recentBadges.map((badge: any) => (
              <div key={badge.id} className="flex items-center gap-3">
                <BadgeMedal badge={badge} size="sm" />
                <div>
                  <h5 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
                    {badge.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 capitalize">{badge.tier} Medal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
