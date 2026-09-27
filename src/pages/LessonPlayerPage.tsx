import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Flame,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { api } from "../services/api";
import { Pip } from "../components/brand/Pip";
import { BadgeMedal } from "../components/brand/BadgeMedal";
import { LevelUpCelebration } from "../components/gamification/LevelUpCelebration";
import { XpRewardCard } from "../components/gamification/XpRewardCard";
import { motion, AnimatePresence } from "motion/react";
import { sounds, isSoundEnabled, setSoundEnabled } from "../utils/sound";
import { useAuth } from "../context/AuthContext";
import { PipAssistantModal } from "../components/brand/PipAssistantModal";

export const LessonPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [mission, setMission] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sound toggle
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Player phases: "LESSON" | "QUESTIONS" | "COMPLETED"
  const [phase, setPhase] = useState<"LESSON" | "QUESTIONS" | "COMPLETED">("LESSON");

  // Question answering state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checkedQuestionIds, setCheckedQuestionIds] = useState<Set<string>>(new Set());
  const [checkingQuestion, setCheckingQuestion] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState<
    Record<
      string,
      {
        isCorrect: boolean;
        correctIndex: number;
        correctOptionText?: string;
        explanation: string;
      }
    >
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showLevelUpPreview, setShowLevelUpPreview] = useState(false);

  // AI Tutor explanations
  const [tutorExplaining, setTutorExplaining] = useState<string | null>(null);
  const [tutorExplanations, setTutorExplanations] = useState<Record<string, string>>({});
  const [showPipAssistant, setShowPipAssistant] = useState(false);

  const toggleAudio = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.missions
      .getById(id)
      .then((res) => {
        setMission(res.mission);
      })
      .catch((err) => {
        setError(err.message || "Failed to load mission.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1020]">
        <div className="text-center space-y-3">
          <Pip mood="thinking" size="md" />
          <p className="text-sm font-medium text-slate-500">Preparing your mission...</p>
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1020] px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <Pip mood="thinking" size="md" />
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Mission Unavailable
          </h2>
          <p className="text-xs text-slate-500">{error || "Could not load this mission."}</p>
          <Link
            to="/app"
            className="btn-3d px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-display text-sm inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const questions = mission.questions || [];
  const currentQ = questions[currentQuestionIdx];
  const isCurrentQChecked = currentQ ? checkedQuestionIds.has(currentQ.id) : false;
  const currentSelection = currentQ ? selectedAnswers[currentQ.id] : undefined;

  // Check an individual question's answer in real-time
  const handleCheckQuestion = async () => {
    if (!currentQ || currentSelection === undefined || checkingQuestion) return;
    setCheckingQuestion(true);
    const selectedText = currentQ.options?.[currentSelection] || "";

    try {
      const res = await api.missions.checkQuestion(mission.id, {
        questionId: currentQ.id,
        selectedIndex: currentSelection,
        selectedOptionText: selectedText,
      });

      setQuestionFeedback((prev) => ({
        ...prev,
        [currentQ.id]: {
          isCorrect: res.isCorrect,
          correctIndex: res.correctIndex,
          correctOptionText: res.correctOptionText,
          explanation: res.explanation,
        },
      }));
      setCheckedQuestionIds((prev) => new Set(prev).add(currentQ.id));

      if (process.env.NODE_ENV !== "production" || (import.meta as any).env?.DEV) {
        console.log(
          `[Quiz Check] Question ${currentQ.id} ("${currentQ.prompt.slice(0, 35)}..."): submittedIndex=${currentSelection} ("${selectedText}"), expectedIndex=${res.correctIndex} ("${res.correctOptionText}") => isCorrect=${res.isCorrect}`
        );
      }

      if (res.isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }
    } catch (err: any) {
      console.error("Failed to check question with server:", err);
      // Client-side fallback if server check has an issue
      const fallbackCorrect =
        currentQ.correctIndex !== undefined
          ? Number(currentSelection) === Number(currentQ.correctIndex)
          : false;

      setQuestionFeedback((prev) => ({
        ...prev,
        [currentQ.id]: {
          isCorrect: fallbackCorrect,
          correctIndex: currentQ.correctIndex ?? -1,
          correctOptionText: currentQ.options?.[currentQ.correctIndex] ?? "",
          explanation: currentQ.explanation ?? "",
        },
      }));
      setCheckedQuestionIds((prev) => new Set(prev).add(currentQ.id));

      if (fallbackCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }
    } finally {
      setCheckingQuestion(false);
    }
  };

  // Next question or trigger final submission
  const handleNextQuestion = async () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Submit all answers to the server
      setSubmitting(true);
      try {
        const payload = questions.map((q: any) => ({
          questionId: q.id,
          selectedIndex: selectedAnswers[q.id] ?? -1,
          selectedOptionText: q.options?.[selectedAnswers[q.id]] ?? "",
        }));

        const result = await api.missions.submit(mission.id, payload);
        setSubmissionResult(result);
        setPhase("COMPLETED");
        await refreshUser();

        if (result.leveledUp) {
          setShowLevelUpModal(true);
          sounds.playLevelUp();
        } else if (result.passed) {
          sounds.playCorrect();
        }

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } catch (err: any) {
        console.error("Failed to submit mission:", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Request AI Tutor explanation
  const handleRequestTutor = async (questionId: string) => {
    setTutorExplaining(questionId);
    try {
      const questionsList = (mission?.questions || []) as any[];
      const currentQ = questionsList.find((q: any) => q.id === questionId);
      const userChoiceIdx = selectedAnswers[questionId];
      const userSelectedOption =
        userChoiceIdx !== undefined && currentQ && currentQ.options && currentQ.options[userChoiceIdx]
          ? currentQ.options[userChoiceIdx]
          : undefined;
      const res = await api.tutor.explain(questionId, userSelectedOption);
      setTutorExplanations((prev) => ({
        ...prev,
        [questionId]: res.explanation,
      }));
    } catch {
      setTutorExplanations((prev) => ({
        ...prev,
        [questionId]: "Pip recommends focusing on the core principle of this mission: connect the lesson to a daily habit you already practice to lock in the intuition!",
      }));
    } finally {
      setTutorExplaining(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080C18] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* 1. TOP MINIMAL FOCUS HEADER */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            to={mission.book ? `/app/books/${mission.book.slug}` : "/app"}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Exit Mission"
          >
            <X size={20} />
          </Link>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-slate-400">
              {mission.book?.title}
            </span>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Mission {mission.order}: {mission.title}
            </p>
          </div>
        </div>

        {/* Center Progress Bar */}
        {phase === "QUESTIONS" && (
          <div className="flex-1 max-w-xs mx-4">
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span className="font-display text-indigo-600 dark:text-indigo-400 font-bold">{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
              <div
                className="h-full rounded-full transition-all duration-300 shimmer-active"
                style={{
                  width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`,
                  background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  boxShadow: "0 0 8px rgba(79, 70, 229, 0.4)",
                }}
              />
            </div>
          </div>
        )}

        {/* Actions: Ask Pip AI & Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPipAssistant(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold transition-colors border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm"
            title="Ask Pip AI tutor"
          >
            <Sparkles size={14} className="text-amber-500 fill-amber-500" />
            <span>Ask Pip AI</span>
          </button>
          <button
            type="button"
            onClick={toggleAudio}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundOn ? "Mute sounds" : "Unmute sounds"}
          >
            {soundOn ? <Volume2 size={18} className="text-indigo-600" /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* PHASE A: THE LESSON TEXT */}
        {phase === "LESSON" && (
          <div className="space-y-8 bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-0.5 rounded-md">
                  Mission {mission.order} • {mission.estimatedMinutes} min read
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {mission.title}
              </h1>
              <p className="text-sm font-medium text-slate-500">{mission.summary}</p>
            </div>

            {/* Lesson Body Formatted */}
            <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans border-t border-slate-100 dark:border-slate-800 pt-6">
              {mission.lessonContent.split("\n\n").map((paragraph: string, idx: number) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="font-display font-bold text-xl text-slate-900 dark:text-white pt-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1">
                      {paragraph.split("\n").map((item, i) => (
                        <li key={i}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>

            {/* Bottom CTA to start interactive questions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Pip mood="happy" size="sm" />
                <button
                  type="button"
                  onClick={() => setShowPipAssistant(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                  <span>Confused? Ask Pip AI for an analogy</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPhase("QUESTIONS")}
                className="btn-3d px-8 py-3.5 rounded-2xl font-display font-bold text-base flex items-center gap-2"
              >
                <span>Start Practice Quiz</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* PHASE B: QUESTIONS PLAYER */}
        {phase === "QUESTIONS" && currentQ && (
          <div className="space-y-6 bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Recall Question {currentQuestionIdx + 1}
                </span>
                <span className="text-xs font-semibold text-[#FACC15] flex items-center gap-1">
                  <Zap size={14} className="fill-current" />
                  +10 XP
                </span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
                {currentQ.prompt}
              </h2>
            </div>

            {/* Question Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt: string, optIdx: number) => {
                const feedback = questionFeedback[currentQ.id];
                const isSelected = currentSelection === optIdx;
                const targetCorrectIndex = feedback?.correctIndex ?? currentQ.correctIndex;
                const isOptionCorrect =
                  targetCorrectIndex !== undefined && Number(optIdx) === Number(targetCorrectIndex);

                let cardStyle =
                  "bg-slate-50 dark:bg-[#18223C] border-slate-200/90 dark:border-white/10 hover:border-indigo-400 text-slate-800 dark:text-slate-200 hover:shadow-xs active:scale-[0.99]";

                if (isSelected && !isCurrentQChecked) {
                  cardStyle =
                    "bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold ring-2 ring-indigo-500/20";
                } else if (isCurrentQChecked) {
                  if (isOptionCorrect) {
                    cardStyle =
                      "bg-[#22C55E]/15 dark:bg-[#22C55E]/20 border-[#22C55E] text-emerald-900 dark:text-emerald-200 font-semibold animate-pop-bounce ring-2 ring-[#22C55E]/30";
                  } else if (isSelected && !isOptionCorrect) {
                    cardStyle =
                      "bg-[#EF4444]/15 dark:bg-[#EF4444]/20 border-[#EF4444] text-rose-900 dark:text-rose-200 font-semibold animate-shake";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isCurrentQChecked || checkingQuestion}
                    onClick={() =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [currentQ.id]: optIdx,
                      }))
                    }
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between text-sm sm:text-base ${cardStyle}`}
                  >
                    <span>{opt}</span>
                    {isCurrentQChecked && isOptionCorrect && (
                      <CheckCircle2 size={20} className="text-[#22C55E] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Question Explanation & AI Tutor */}
            {isCurrentQChecked && (() => {
              const feedback = questionFeedback[currentQ.id];
              const isAnswerCorrect = feedback
                ? feedback.isCorrect
                : (currentQ.correctIndex !== undefined && Number(currentSelection) === Number(currentQ.correctIndex));
              const explanationText = feedback?.explanation || currentQ.explanation;

              return (
                <div
                  className={`p-4 rounded-2xl border text-sm space-y-3 relative ${
                    isAnswerCorrect
                      ? "bg-[#22C55E]/10 dark:bg-[#22C55E]/15 border-[#22C55E]/40 text-emerald-950 dark:text-emerald-100 animate-pop-bounce"
                      : "bg-[#EF4444]/10 dark:bg-[#EF4444]/15 border-[#EF4444]/40 text-rose-950 dark:text-rose-100 animate-shake"
                  }`}
                >
                  {isAnswerCorrect && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-md bg-[#FACC15] text-amber-950 font-display font-extrabold text-xs shadow-md animate-float-xp pointer-events-none">
                      +10 XP
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Pip
                      mood={isAnswerCorrect ? "cheering" : "thinking"}
                      size="sm"
                      animate={false}
                    />
                    <div>
                      <p className="font-bold font-display text-base">
                        {isAnswerCorrect ? "Spot On! +10 XP" : "Incorrect"}
                      </p>
                      {explanationText && (
                        <p className="mt-1 text-xs sm:text-sm leading-relaxed opacity-95">
                          {explanationText}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AI Tutor breakdown button */}
                  <div className="pt-2 border-t border-slate-200/40 flex flex-col gap-2">
                    {!tutorExplanations[currentQ.id] ? (
                      <button
                        type="button"
                        disabled={tutorExplaining === currentQ.id}
                        onClick={() => handleRequestTutor(currentQ.id)}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                      >
                        <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                        <span>
                          {tutorExplaining === currentQ.id
                            ? "Pip is formulating an analogy with Gemini..."
                            : "Ask Pip AI for a personalized analogy"}
                        </span>
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-xs leading-relaxed text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-indigo-900/40 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                            <Sparkles size={14} className="fill-indigo-500" />
                            <span>Pip's Insight:</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPipAssistant(true)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
                          >
                            Ask Pip follow-up
                          </button>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          {tutorExplanations[currentQ.id]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Question Action Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Question {currentQuestionIdx + 1} of {questions.length}
              </span>

              {!isCurrentQChecked ? (
                <button
                  type="button"
                  disabled={currentSelection === undefined || checkingQuestion}
                  onClick={handleCheckQuestion}
                  className="btn-3d px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm disabled:opacity-50"
                >
                  {checkingQuestion ? "Checking..." : "Check Answer"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleNextQuestion}
                  className="btn-3d px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{currentQuestionIdx < questions.length - 1 ? "Next Question" : "Complete Mission"}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHASE C: MISSION COMPLETION CELEBRATION */}
        {phase === "COMPLETED" && submissionResult && (
          <div className="space-y-8 bg-white dark:bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] text-center">
            <div className="space-y-3">
              <Pip
                mood={submissionResult.passed ? "proud" : "happy"}
                size="md"
                speechBubble={submissionResult.passed ? "Brilliant work!" : "Good effort!"}
              />
              <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
                {submissionResult.passed ? "Mission Completed!" : "Mission Finished!"}
              </h1>
              <p className="text-sm text-slate-500">
                You scored {submissionResult.score} of {submissionResult.totalQuestions} ({submissionResult.percentage}%)
              </p>
            </div>

            {/* Modal Level-Up Celebration with Framer Motion */}
            <AnimatePresence>
              {(showLevelUpModal || showLevelUpPreview) && (
                <LevelUpCelebration
                  level={showLevelUpPreview ? (submissionResult.level + 1) : submissionResult.level}
                  previousLevel={showLevelUpPreview ? submissionResult.level : (submissionResult.previousLevel ?? Math.max(1, submissionResult.level - 1))}
                  xpEarned={submissionResult.xpEarned}
                  totalXp={submissionResult.totalXp}
                  xpProgress={submissionResult.xpProgress}
                  onClose={() => {
                    setShowLevelUpModal(false);
                    setShowLevelUpPreview(false);
                  }}
                />
              )}
            </AnimatePresence>

            {/* Rewards Summary Grid with Framer Motion XP count-up */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <XpRewardCard
                xpEarned={submissionResult.xpEarned}
                totalXp={submissionResult.totalXp}
              />

              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-center">
                <span className="text-xs text-orange-700 dark:text-orange-400 font-semibold">Current Streak</span>
                <p className="font-display font-bold text-2xl text-orange-900 dark:text-orange-200 mt-0.5">
                  {submissionResult.currentStreak} Days
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center col-span-2 sm:col-span-1">
                <span className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold">Current Level</span>
                <p className="font-display font-bold text-2xl text-indigo-900 dark:text-indigo-200 mt-0.5">
                  Lvl {submissionResult.level}
                </p>
              </div>
            </div>

            {/* Level up banner if applicable (or progression preview) */}
            {submissionResult.leveledUp ? (
              <motion.div
                id="level-up-achieved-banner"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="relative p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-slate-900 dark:text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-xl bg-[#3730A3] flex items-center justify-center text-white shadow-md font-display font-black text-xl shrink-0">
                    {submissionResult.level}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>Level Up Achieved!</span>
                    </div>
                    <p className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Advanced to Level {submissionResult.level}
                    </p>
                  </div>
                </div>

                <button
                  id="replay-level-up-modal-btn"
                  type="button"
                  onClick={() => setShowLevelUpModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Sparkles size={13} />
                  <span>Replay Celebration</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                id="level-progress-banner"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-lg mx-auto text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-display font-bold text-sm shrink-0">
                    Lvl {submissionResult.level}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Climbing toward Level {submissionResult.level + 1}!
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Complete your next mission or review cards to level up.
                    </p>
                  </div>
                </div>

                <button
                  id="preview-level-up-btn"
                  type="button"
                  onClick={() => setShowLevelUpPreview(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-display font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  title="Preview level up animation"
                >
                  <Sparkles size={13} />
                  <span>Preview Level Up</span>
                </button>
              </motion.div>
            )}

            {/* Badges unlocked */}
            {submissionResult.newBadges && submissionResult.newBadges.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  New Medal Unlocked!
                </h4>
                <div className="flex justify-center gap-6">
                  {submissionResult.newBadges.map((badge: any) => (
                    <div key={badge.id} className="flex items-center gap-3">
                      <BadgeMedal badge={badge} size="md" />
                      <div className="text-left">
                        <p className="font-display font-bold text-sm text-slate-900 dark:text-white">{badge.name}</p>
                        <p className="text-xs text-slate-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spaced repetition notice */}
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto flex items-center justify-center gap-1.5">
              <Lightbulb size={14} className="text-amber-500 shrink-0" />
              <span>These questions have been added to your Spaced Repetition deck. Check your Review tab tomorrow to keep them sharp!</span>
            </p>

            {/* Navigation options */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {submissionResult.nextMissionId ? (
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/app/missions/${submissionResult.nextMissionId}`);
                    window.location.reload();
                  }}
                  className="btn-3d w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white font-display font-bold text-base flex items-center justify-center gap-2"
                >
                  <span>Next Mission</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <Link
                  to={mission.book ? `/app/books/${mission.book.slug}` : "/app"}
                  className="btn-3d w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white font-display font-bold text-base"
                >
                  View Book Path
                </Link>
              )}

              <Link
                to="/app"
                className="btn-3d-neutral w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-display font-semibold text-sm"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Pip AI Assistant Drawer / Modal */}
      <PipAssistantModal
        isOpen={showPipAssistant}
        onClose={() => setShowPipAssistant(false)}
        context={{
          bookTitle: mission?.book?.title,
          missionTitle: mission?.title,
          concept: currentQ?.conceptTag,
        }}
      />
    </div>
  );
};
