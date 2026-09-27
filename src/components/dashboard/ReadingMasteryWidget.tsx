import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Pip } from "../brand/Pip";

export interface ReadingMasteryHistoryPoint {
  date: string;
  label: string;
  missionsMastered: number;
  cumulativeMissions: number;
  booksCompleted: number;
  cumulativeBooks: number;
}

export interface ReadingMasterySummary {
  totalMissionsMastered30d: number;
  totalBooksCompleted30d: number;
  totalMissionsMasteredAllTime: number;
  totalBooksCompletedAllTime: number;
  activeDaysCount30d: number;
  weeklyVelocityMissions: number;
  completionRatePercent: number;
}

export interface ReadingMasteryWidgetProps {
  data?: {
    history: ReadingMasteryHistoryPoint[];
    summary: ReadingMasterySummary;
  };
  className?: string;
  nextMissionId?: string;
}

export const ReadingMasteryWidget: React.FC<ReadingMasteryWidgetProps> = ({
  data,
  className = "",
  nextMissionId,
}) => {
  const [viewMode, setViewMode] = useState<"cumulative" | "daily">("cumulative");
  const [metricFilter, setMetricFilter] = useState<"all" | "missions" | "books">("all");

  const history = data?.history || [];
  const summary = data?.summary || {
    totalMissionsMastered30d: 0,
    totalBooksCompleted30d: 0,
    totalMissionsMasteredAllTime: 0,
    totalBooksCompletedAllTime: 0,
    activeDaysCount30d: 0,
    weeklyVelocityMissions: 0,
    completionRatePercent: 0,
  };

  const hasActivity =
    summary.totalMissionsMastered30d > 0 ||
    summary.totalBooksCompleted30d > 0 ||
    summary.totalMissionsMasteredAllTime > 0;

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0]?.payload as ReadingMasteryHistoryPoint;
      if (!point) return null;

      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl text-xs space-y-2 min-w-[200px] z-50">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white">{point.label}</span>
            <span className="text-[10px] text-slate-400 font-mono">{point.date}</span>
          </div>

          <div className="space-y-1.5">
            {viewMode === "cumulative" ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                    <span className="text-slate-600 dark:text-slate-300">Total Missions:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {point.cumulativeMissions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-slate-600 dark:text-slate-300">Total Books:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {point.cumulativeBooks}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                    <span className="text-slate-600 dark:text-slate-300">Missions Mastered:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {point.missionsMastered}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-slate-600 dark:text-slate-300">Books Completed:</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {point.booksCompleted}
                  </span>
                </div>
              </>
            )}

            {point.booksCompleted > 0 && (
              <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles size={12} />
                <span>Book finished on this day!</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="reading-mastery-widget"
      className={`bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-6 ${className}`}
    >
      {/* 1. Header with Title, Mascot Badge, and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
              <TrendingUp size={13} />
              Performance Analytics
            </span>
            <span className="text-[11px] text-slate-400 font-medium">30-Day Window</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Reading Mastery
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              {summary.weeklyVelocityMissions > 0
                ? `${summary.weeklyVelocityMissions} missions/wk pace`
                : "Active Tracking"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track books completed and missions mastered over the past 30 days.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <div
            id="reading-mastery-view-mode-toggle"
            className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            <button
              id="reading-mastery-tab-cumulative"
              type="button"
              onClick={() => setViewMode("cumulative")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "cumulative"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Cumulative Progress
            </button>
            <button
              id="reading-mastery-tab-daily"
              type="button"
              onClick={() => setViewMode("daily")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "daily"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Daily Velocity
            </button>
          </div>

          <div
            id="reading-mastery-filter-toggle"
            className="hidden md:inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            <button
              id="reading-mastery-filter-all"
              type="button"
              onClick={() => setMetricFilter("all")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                metricFilter === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              id="reading-mastery-filter-missions"
              type="button"
              onClick={() => setMetricFilter("missions")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                metricFilter === "missions"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Missions
            </button>
            <button
              id="reading-mastery-filter-books"
              type="button"
              onClick={() => setMetricFilter("books")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                metricFilter === "books"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Books
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Books Completed Metric */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Books Completed
            </span>
            <BookOpen size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              {summary.totalBooksCompleted30d}
            </span>
            <span className="text-xs text-slate-400">
              ({summary.totalBooksCompletedAllTime} all-time)
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {summary.completionRatePercent}% of catalog mastered
          </p>
        </div>

        {/* Missions Mastered Metric */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Missions Mastered
            </span>
            <CheckCircle2 size={16} className="text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              {summary.totalMissionsMastered30d}
            </span>
            <span className="text-xs text-slate-400">
              ({summary.totalMissionsMasteredAllTime} all-time)
            </span>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Past 30 days active recall
          </p>
        </div>

        {/* Learning Velocity Metric */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Weekly Velocity
            </span>
            <TrendingUp size={16} className="text-teal-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              {summary.weeklyVelocityMissions}
            </span>
            <span className="text-xs text-slate-400">missions/wk</span>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
            Rolling momentum
          </p>
        </div>

        {/* Active Study Days */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Study Consistency
            </span>
            <Calendar size={16} className="text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              {summary.activeDaysCount30d}
            </span>
            <span className="text-xs text-slate-400">of 30 days active</span>
          </div>
          <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
            {Math.round((summary.activeDaysCount30d / 30) * 100)}% monthly coverage
          </p>
        </div>
      </div>

      {/* 3. Recharts Visualizer Canvas */}
      <div className="relative pt-2">
        {!hasActivity && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-2xl p-6 text-center space-y-3">
            <Pip mood="thinking" size="sm" />
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Begin Your Reading Mastery
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Complete missions and finish books to see your mastery curves climb over the past 30 days.
            </p>
            {nextMissionId ? (
              <Link
                to={`/app/missions/${nextMissionId}`}
                className="btn-3d px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>Start Mission</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to="/app/books"
                className="btn-3d px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>Browse Library</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={history}
              margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorMissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorBooks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                opacity={0.15}
              />

              <XAxis
                dataKey="label"
                interval={4}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1", opacity: 0.4 }}
                tickLine={false}
              />

              {/* Left YAxis: Missions Scale */}
              <YAxis
                yAxisId="left"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#6366F1" }}
                axisLine={false}
                tickLine={false}
              />

              {/* Right YAxis: Books Scale */}
              <YAxis
                yAxisId="right"
                orientation="right"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#10B981" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
                formatter={(value) => (
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {value}
                  </span>
                )}
              />

              {viewMode === "cumulative" ? (
                <>
                  {/* Cumulative Missions Mastered (Area) */}
                  {(metricFilter === "all" || metricFilter === "missions") && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="cumulativeMissions"
                      name="Missions Mastered"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorMissions)"
                    />
                  )}

                  {/* Cumulative Books Completed (Line with dots) */}
                  {(metricFilter === "all" || metricFilter === "books") && (
                    <Line
                      yAxisId="right"
                      type="stepAfter"
                      dataKey="cumulativeBooks"
                      name="Books Completed"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#10B981", strokeWidth: 1.5, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Daily Missions Mastered (Bar) */}
                  {(metricFilter === "all" || metricFilter === "missions") && (
                    <Bar
                      yAxisId="left"
                      dataKey="missionsMastered"
                      name="Missions Mastered"
                      fill="#6366F1"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={14}
                    />
                  )}

                  {/* Daily Books Completed (Bar or Line Marker) */}
                  {(metricFilter === "all" || metricFilter === "books") && (
                    <Bar
                      yAxisId="right"
                      dataKey="booksCompleted"
                      name="Books Completed"
                      fill="#10B981"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={14}
                    />
                  )}
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Bottom Contextual Note & Insights */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>
            {summary.totalBooksCompleted30d > 0
              ? `You've conquered ${summary.totalBooksCompleted30d} full book${
                  summary.totalBooksCompleted30d > 1 ? "s" : ""
                } and mastered ${summary.totalMissionsMastered30d} missions this month!`
              : summary.totalMissionsMastered30d > 0
              ? `Great progress! ${summary.totalMissionsMastered30d} missions mastered in the last 30 days.`
              : "Complete your next interactive mission to start your 30-day mastery timeline."}
          </span>
        </div>

        <Link
          to="/app/books"
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Explore Book Pathways</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
