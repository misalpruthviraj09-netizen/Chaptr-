import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  Brain,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Compass,
  Lock,
  Layers,
  Repeat,
  Check,
  Zap,
} from "lucide-react";
import { APP_NAME, MASCOT_NAME, TAGLINE, PITCH } from "../config/brand";
import { Logo } from "../components/brand/Logo";
import { Pip } from "../components/brand/Pip";
import { BookCover } from "../components/brand/BookCover";
import { BadgeMedal } from "../components/brand/BadgeMedal";
import { MasteryRing } from "../components/brand/MasteryRing";
import { LearningPath, PathMissionNode } from "../components/brand/LearningPath";
import { HeroGraphic } from "../components/brand/HeroGraphic";
import { KnowledgeConstellationGraphic } from "../components/brand/KnowledgeConstellationGraphic";
import {
  TsundokuGraphic,
  ForgettingCurveGraphic,
  PassiveSkimmingGraphic,
  SummariesGraphic,
  ZeroAccountabilityGraphic,
} from "../components/brand/ProblemGraphics";
import { api } from "../services/api";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  // Waitlist form state
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistRole, setWaitlistRole] = useState<
    "STUDENT" | "PROFESSIONAL" | "LIFELONG_LEARNER" | "EDUCATOR" | "OTHER"
  >("PROFESSIONAL");
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState<string | null>(null);
  const [waitlistQueue, setWaitlistQueue] = useState<number | null>(null);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistConsent, setWaitlistConsent] = useState(false);

  // FAQ accordion active state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sample Path missions for "Habit Building Basics"
  const samplePathMissions: PathMissionNode[] = [
    {
      id: "m1",
      order: 1,
      title: "The Habit Loop: Cue, Routine, Reward",
      summary: "Master the 3-part neurological loop behind every automated behavior.",
      estimatedMinutes: 5,
      status: "COMPLETED",
      bestScore: 100,
    },
    {
      id: "m2",
      order: 2,
      title: "The 2-Minute Rule & Friction",
      summary: "Scale down any habit so it takes two minutes or less to start.",
      estimatedMinutes: 5,
      status: "UNLOCKED",
      bestScore: 0,
    },
    {
      id: "m3",
      order: 3,
      title: "Habit Stacking & Implementation Intentions",
      summary: "Pair new actions with existing anchors throughout your day.",
      estimatedMinutes: 6,
      status: "LOCKED",
    },
    {
      id: "m4",
      order: 4,
      title: "Identity-Based Habits & The Mastery Mindset",
      summary: "Shift focus from outcomes to the type of person you wish to become.",
      estimatedMinutes: 6,
      status: "LOCKED",
    },
  ];

  // Waitlist submission handler
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistError(null);
    setWaitlistSuccess(null);

    if (!waitlistConsent) {
      setWaitlistError("Please check the box to agree to receiving emails and accept the Privacy Policy.");
      return;
    }

    setWaitlistLoading(true);

    try {
      const res = await api.waitlist.join({
        name: waitlistName.trim(),
        email: waitlistEmail.trim(),
        role: waitlistRole,
      });

      setWaitlistSuccess(res.message);
      setWaitlistQueue(res.queuePosition);
      setWaitlistName("");
      setWaitlistEmail("");
    } catch (err: any) {
      setWaitlistError(err.message || "Failed to join waitlist. Please try again.");
    } finally {
      setWaitlistLoading(false);
    }
  };

  const faqs = [
    {
      q: `What is ${APP_NAME} and how does it work?`,
      a: `${APP_NAME} turns high-impact non-fiction books into structured learning paths of 5-to-10 minute missions. Instead of passively reading or skimming summaries, you complete interactive lessons, test yourself with active recall questions, earn XP and badges, and retain knowledge permanently using automated spaced repetition.`,
    },
    {
      q: "Where does the book content come from?",
      a: "We work toward licensing and partnerships with authors and publishers, and we also use public-domain books and original educational content created by learning designers.",
    },
    {
      q: "How does the spaced repetition review system work?",
      a: `When you complete missions, questions are automatically added to your personal review deck. Using the SM-2 spaced repetition algorithm, ${APP_NAME} schedules reviews right when your brain is on the verge of forgetting (1 day, 3 days, 1 week, etc.), moving concepts into permanent long-term memory.`,
    },
    {
      q: "What is the Book Mastery Score?",
      a: "Unlike typical apps that merely show completion percentages, our Book Mastery Score tracks four cognitive pillars: Understanding (concept comprehension), Recall (retrieval accuracy), Application (scenario problem-solving), and Retention (spaced repetition accuracy over 30 days).",
    },
    {
      q: "Is Chaptr completely free to use?",
      a: `Yes! ${APP_NAME} is 100% free. All books, interactive missions, spaced repetition review decks, community leaderboards, and AI tutoring are available to all scholars at zero cost with no subscriptions, paywalls, or hidden fees.`,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Soft floating background ambient glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-3xl blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/10 dark:bg-teal-500/10 rounded-3xl blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/80 text-[#3730A3] dark:text-indigo-300 text-xs font-semibold shadow-xs">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Public-domain classics & original curriculum at launch</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-950 dark:text-white leading-[1.12]">
                Master non-fiction books through{" "}
                <span className="text-[#3730A3] dark:text-indigo-400">
                  5-minute interactive missions.
                </span>
              </h1>

              {/* Pitch */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Chaptr breaks down high-impact non-fiction books into 5-minute interactive missions. Test your understanding, lock key concepts into memory with spaced repetition, and apply what you learn.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="btn-3d w-full sm:w-auto px-8 py-4 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white font-display font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#sample-path"
                  className="btn-3d-neutral w-full sm:w-auto px-6 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-display font-semibold text-base flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} className="text-[#3730A3] dark:text-indigo-400" />
                  <span>Explore Curriculum</span>
                </a>
              </div>

              {/* Stat / Feature badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>5-10 Minute Missions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3730A3]" />
                  <span>Active Recall Quizzes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>SM-2 Spaced Repetition</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic: Premier interactive mission card with floating satellites and Pip */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <HeroGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM (5 CARDS) */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Why most reading fails to create real change
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Traditional non-fiction reading is broken. High friction, passive consumption, and rapid forgetting make it hard to get lasting value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Problem 1 */}
            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-400 transition-colors">
              <div>
                <TsundokuGraphic className="text-slate-700 dark:text-slate-300" />
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mt-2">
                  The Tsundoku Trap
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  We buy ambitious 350-page books with excitement, only for them to sit unread on nightstands and digital shelves.
                </p>
              </div>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Unfinished Ambitions</span>
            </div>

            {/* Problem 2 */}
            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-400 transition-colors">
              <div>
                <ForgettingCurveGraphic className="text-slate-700 dark:text-slate-300" />
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mt-2">
                  The Forgetting Curve
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Research confirms we forget over 75% of what we read within 48 hours without systematic retrieval practice.
                </p>
              </div>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Rapid Memory Decay</span>
            </div>

            {/* Problem 3 */}
            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-400 transition-colors">
              <div>
                <PassiveSkimmingGraphic className="text-slate-700 dark:text-slate-300" />
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mt-2">
                  Passive Skimming
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Highlighters and passive skimming create an "illusion of competence." Recognition is not actual recall.
                </p>
              </div>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Illusion of Competence</span>
            </div>

            {/* Problem 4 */}
            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-400 transition-colors">
              <div>
                <SummariesGraphic className="text-slate-700 dark:text-slate-300" />
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mt-2">
                  Summaries Lack Practice
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Traditional book summaries condense text into shorter text, but still leave you passively reading without testing.
                </p>
              </div>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">No Active Exercises</span>
            </div>

            {/* Problem 5 */}
            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-400 transition-colors">
              <div>
                <ZeroAccountabilityGraphic className="text-slate-700 dark:text-slate-300" />
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mt-2">
                  Zero Accountability
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  No feedback loops, streaks, or milestones mean life gets in the way and consistent learning habits collapse.
                </p>
              </div>
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">No Habit Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              How {APP_NAME} makes learning stick
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              A 4-step pedagogical loop that takes you from initial curiosity to durable cognitive mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-display font-bold text-lg">
                1
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                5-Min Focused Missions
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Books are broken into bite-sized missions designed to fit into your commute, morning coffee, or break. No overwhelming 30-page chapters.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center font-display font-bold text-lg">
                2
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Active Recall & Scenarios
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Each mission presents scenario challenges and recall questions that test understanding immediately, solidifying core concepts into working memory.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-display font-bold text-lg">
                3
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                XP, Streaks & Mastery
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Earn XP for every question, maintain daily streaks, unlock 3-tier metallic badges, and watch your Book Mastery Score climb toward 100%.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-display font-bold text-lg">
                4
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Spaced Repetition
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our SM-2 review engine queues cards right before you're predicted to forget them. A 3-minute daily review locks insights in for years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SAMPLE LEARNING PATH PREVIEW */}
      <section id="sample-path" className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-[#3730A3] dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Interactive Path Preview
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Habit Building Basics
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Every book transforms into a tactile learning expedition. Here is the sample path for our foundational habit curriculum.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <LearningPath
              missions={samplePathMissions}
              onSelectMission={() => {
                navigate("/register");
              }}
            />
            <div className="text-center pt-4">
              <Link
                to="/register"
                className="btn-3d inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white font-display font-semibold text-sm"
              >
                <span>Explore All Books & Missions</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MASTERY DASHBOARD MOCKUP (LABELED "Sample Dashboard") */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              Sample Dashboard
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Measure genuine understanding, not just pages flipped
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              The {APP_NAME} dashboard measures four distinct dimensions of cognitive mastery for every single book.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3730A3] text-white flex items-center justify-center font-display font-bold shadow-sm">
                  P
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Alex Rivers
                  </h4>
                  <p className="text-xs text-slate-500">Level 4 Scholar • 920 XP</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] font-bold text-xs">
                <Flame size={16} className="fill-current animate-flame-pulse" />
                <span>7-Day Streak!</span>
              </div>
            </div>

            {/* Mastery Rings showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18223C] border border-slate-200/80 dark:border-white/10 space-y-2">
                <MasteryRing score={88} size="md" />
                <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">Understanding</h5>
                <p className="text-xs text-slate-500">First-attempt accuracy</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18223C] border border-slate-200/80 dark:border-white/10 space-y-2">
                <MasteryRing score={92} size="md" />
                <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">Active Recall</h5>
                <p className="text-xs text-slate-500">Retrieval speed & correctness</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18223C] border border-slate-200/80 dark:border-white/10 space-y-2">
                <MasteryRing score={75} size="md" />
                <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">Application</h5>
                <p className="text-xs text-slate-500">Scenario decision accuracy</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18223C] border border-slate-200/80 dark:border-white/10 space-y-2">
                <MasteryRing score={85} size="md" />
                <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">Retention</h5>
                <p className="text-xs text-slate-500">30-day spaced repetition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GAMIFICATION BENTO GRID */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Built to turn reading into a daily habit you love
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Harnessing proven behavioral loops so you look forward to opening a book every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Badges */}
            <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <BadgeMedal
                  badge={{
                    key: "first_mission",
                    name: "First Step",
                    description: "Complete your first mission",
                    tier: "bronze",
                    icon: "Sparkles",
                    isEarned: true,
                  }}
                  size="sm"
                />
                <BadgeMedal
                  badge={{
                    key: "perfect_score",
                    name: "Flawless",
                    description: "100% mission score",
                    tier: "silver",
                    icon: "Star",
                    isEarned: true,
                  }}
                  size="sm"
                />
                <BadgeMedal
                  badge={{
                    key: "streak_7",
                    name: "Week Warrior",
                    description: "7-day learning streak",
                    tier: "gold",
                    icon: "Flame",
                    isEarned: true,
                  }}
                  size="sm"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  3-Tier Metallic Medals
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Earn Bronze, Silver, and Gold medals with custom SVG shine animations as you achieve milestones.
                </p>
              </div>
            </div>

            {/* Bento Card 2: Streaks & XP */}
            <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-500">
                  <Flame size={32} className="fill-current animate-pulse" />
                </div>
                <div>
                  <span className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    7 Days
                  </span>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                    Streak Protected
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Timezone-Aware Streaks
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Keep your streak alive with any completed mission or quick review session before midnight in your local timezone.
                </p>
              </div>
            </div>

            {/* Bento Card 3: Friendly Mascot Pip */}
            <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <Pip mood="happy" size="sm" />
                <Pip mood="cheering" size="sm" />
                <Pip mood="thinking" size="sm" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Meet {MASCOT_NAME}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Your cheerful companion who celebrates wins, thinks through hard questions, and keeps you motivated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI PERSONALIZATION (MARKED "Coming soon") */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-[#3730A3] dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                Coming Soon
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Personalized Knowledge Graph & AI Tutor
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Connect concepts across completely different books into a unified cross-disciplinary knowledge constellation. Struggling with a specific concept? Pip will break it down with relatable real-world analogies tailored to your background.
              </p>
              <div className="space-y-2 pt-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#3730A3] dark:text-indigo-400" />
                  <span>Cross-book concept linking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#3730A3] dark:text-indigo-400" />
                  <span>Adaptive difficulty based on your recall accuracy</span>
                </div>
              </div>
            </div>

            {/* Interactive Knowledge Constellation Graphic */}
            <div className="flex items-center justify-center">
              <KnowledgeConstellationGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHY CHAPTR IS DIFFERENT (COMPARISON TABLE) */}
      <section id="why-different" className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B1020]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Why {APP_NAME} is Different
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Learn &gt; Practice &gt; Recall &gt; Apply &gt; Master. Compare traditional summary apps to {APP_NAME}'s pedagogical framework.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-4 font-display font-semibold text-slate-500 dark:text-slate-400">Dimensions</th>
                  <th className="py-4 px-4 font-display font-semibold text-slate-500 dark:text-slate-400">Typical Summary Apps</th>
                  <th className="py-4 px-4 font-display font-bold text-[#3730A3] dark:text-indigo-400 text-base">
                    {APP_NAME}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">Format</td>
                  <td className="py-4 px-4 text-slate-500">Long passive text or 15-min audio blurb</td>
                  <td className="py-4 px-4 text-[#3730A3] dark:text-indigo-400 font-semibold">
                    Interactive 5-minute missions & exercises
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">Retention</td>
                  <td className="py-4 px-4 text-slate-500">None (Forgotten in 48 hours)</td>
                  <td className="py-4 px-4 text-[#3730A3] dark:text-indigo-400 font-semibold">
                    Automated SM-2 spaced repetition deck
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">Testing</td>
                  <td className="py-4 px-4 text-slate-500">No testing or quizzes</td>
                  <td className="py-4 px-4 text-[#3730A3] dark:text-indigo-400 font-semibold">
                    Active recall, MCQs & scenario questions
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">Progress Metric</td>
                  <td className="py-4 px-4 text-slate-500">Binary "Read / Unread"</td>
                  <td className="py-4 px-4 text-[#3730A3] dark:text-indigo-400 font-semibold">
                    4-Pillar Book Mastery Score (0 to 100%)
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">Motivation Engine</td>
                  <td className="py-4 px-4 text-slate-500">Pure willpower</td>
                  <td className="py-4 px-4 text-[#3730A3] dark:text-indigo-400 font-semibold">
                    XP, levels, streaks, leaderboards & badges
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section id="faq" className="py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B1020]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Everything you need to know about {APP_NAME}, our content licensing, and learning methodology.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-semibold text-slate-900 dark:text-white text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. PRIORITY WAITLIST FORM (WIRED TO REAL BACKEND) */}
      <section id="waitlist" className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-8">
            <span className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-[#3730A3] dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Priority Access
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Join the {APP_NAME} Waitlist
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Be the first to access upcoming book paths, community cohorts, and AI tutor features.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            {waitlistSuccess ? (
              <div className="text-center py-6 space-y-4">
                <Pip mood="cheering" size="md" speechBubble="You're on the list!" />
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                  Welcome aboard!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {waitlistSuccess}
                </p>
                {waitlistQueue && (
                  <div className="inline-block px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-[#3730A3] dark:text-indigo-300 font-display font-bold text-base">
                    Your Queue Position: #{waitlistQueue}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                {waitlistError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                    {waitlistError}
                  </div>
                )}

                <div>
                  <label htmlFor="waitlist-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    id="waitlist-name"
                    type="text"
                    required
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="waitlist-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="waitlist-role" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    What best describes you?
                  </label>
                  <select
                    id="waitlist-role"
                    value={waitlistRole}
                    onChange={(e: any) => setWaitlistRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="PROFESSIONAL">Working Professional</option>
                    <option value="STUDENT">Student</option>
                    <option value="LIFELONG_LEARNER">Lifelong Learner</option>
                    <option value="EDUCATOR">Educator / Teacher</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="waitlist-consent"
                    type="checkbox"
                    required
                    checked={waitlistConsent}
                    onChange={(e) => setWaitlistConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="waitlist-consent" className="text-xs text-slate-600 dark:text-slate-300 leading-normal select-none">
                    I agree to receive product updates and mission digests about {APP_NAME}, and accept the{" "}
                    <Link to="/privacy" target="_blank" className="text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    . You can unsubscribe anytime with one click.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={waitlistLoading || !waitlistConsent}
                  className="btn-3d w-full py-3.5 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white font-display font-bold text-base disabled:opacity-50 transition-opacity"
                >
                  {waitlistLoading ? "Submitting..." : "Join Waitlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
