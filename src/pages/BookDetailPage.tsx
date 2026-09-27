import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Clock, BookOpen, ShieldCheck, Award } from "lucide-react";
import { api } from "../services/api";
import { BookCover } from "../components/brand/BookCover";
import { MasteryRing } from "../components/brand/MasteryRing";
import { LearningPath } from "../components/brand/LearningPath";
import { Pip } from "../components/brand/Pip";

export const BookDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.books
      .getBySlug(slug)
      .then((res) => {
        setBook(res.book);
      })
      .catch((err) => {
        setError(err.message || "Book not found.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleStartPath = async () => {
    if (!slug) return;
    setStarting(true);
    try {
      const res = await api.books.start(slug);
      if (res.firstMissionId) {
        navigate(`/app/missions/${res.firstMissionId}`);
      }
    } catch (err: any) {
      console.error("Failed to start book path:", err);
      // Fallback: navigate to first mission if known
      if (book && book.missions && book.missions[0]) {
        navigate(`/app/missions/${book.missions[0].id}`);
      }
    } finally {
      setStarting(false);
    }
  };

  const handleSelectMission = async (mission: any) => {
    if (mission.status === "LOCKED") return;
    if (!book?.isStarted && slug) {
      try {
        await api.books.start(slug);
      } catch (err) {
        console.warn("Auto-starting book path on mission select:", err);
      }
    }
    navigate(`/app/missions/${mission.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-8">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Pip mood="thinking" size="md" />
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
          Book Not Found
        </h2>
        <p className="text-sm text-slate-500">{error || "Could not find the requested book."}</p>
        <Link
          to="/app/books"
          className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-display text-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Library</span>
        </Link>
      </div>
    );
  }

  const nextMission = book.missions.find((m: any) => m.status === "UNLOCKED") || book.missions[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <Link
        to="/app/books"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Library</span>
      </Link>

      {/* Book Header Card */}
      <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4 flex justify-center">
          <BookCover book={book} size="lg" />
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
                {book.category}
              </span>
              {book.isPublicDomain && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={12} />
                  <span>Public Domain Classic</span>
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
              {book.title}
            </h1>
            <p className="text-sm font-medium text-slate-500">{book.author}</p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {book.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-medium">
              <BookOpen size={16} className="text-indigo-500" />
              <span>{book.totalMissions} Missions</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock size={16} className="text-slate-400" />
              <span>{book.totalMinutes} Min Total</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Award size={16} className="text-amber-500" />
              <span>{book.totalMissions * 20 + 60} Total XP</span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            {book.isStarted ? (
              <Link
                to={`/app/missions/${nextMission?.id || book.missions[0]?.id}`}
                className="btn-3d px-8 py-3.5 rounded-2xl font-display font-bold text-sm inline-flex items-center gap-2"
              >
                <span>Continue: Mission {nextMission?.order || 1}</span>
                <Play size={16} className="fill-current" />
              </Link>
            ) : (
              <button
                type="button"
                disabled={starting}
                onClick={handleStartPath}
                className="btn-3d px-8 py-3.5 rounded-2xl font-display font-bold text-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                <span>{starting ? "Starting Path..." : "Start Learning Path"}</span>
                <Play size={16} className="fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mastery Score Box */}
      <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Cognitive Mastery Score
            </h3>
            <p className="text-xs text-slate-500">
              Weighted calculation: 35% Understanding, 25% Recall, 20% Application, 20% Retention.
            </p>
          </div>
          <MasteryRing score={book.mastery?.mastery || 0} size="md" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18223C]">
            <span className="text-xs text-slate-500 font-medium">Understanding</span>
            <p className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
              {book.mastery?.understanding || 0}%
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18223C]">
            <span className="text-xs text-slate-500 font-medium">Recall</span>
            <p className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
              {book.mastery?.recall || 0}%
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18223C]">
            <span className="text-xs text-slate-500 font-medium">Application</span>
            <p className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
              {book.mastery?.application || 0}%
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18223C]">
            <span className="text-xs text-slate-500 font-medium">Retention</span>
            <p className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
              {book.mastery?.retention || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* The Mission Path */}
      <div className="bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Mission Roadmap
          </span>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Your Winding Expedition
          </h2>
          <p className="text-xs text-slate-500">
            Click any unlocked node to jump into the lesson.
          </p>
        </div>

        <LearningPath missions={book.missions} onSelectMission={handleSelectMission} />
      </div>
    </div>
  );
};
