import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronDown, Search, ArrowLeft, ShieldCheck, Sparkles, BookOpen, Lock } from "lucide-react";
import { APP_NAME, MASCOT_NAME, SUPPORT_EMAIL } from "../config/brand";

interface FaqItem {
  question: string;
  category: "Privacy & Data" | "Learning System" | "Books & Copyright" | "Account & Pricing";
  answer: React.ReactNode;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: "Privacy & Data",
    question: `What data does ${APP_NAME} collect?`,
    answer: (
      <div className="space-y-2">
        <p>We believe in total transparency. We collect strictly the following data:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
          <li><strong>Your Name:</strong> To address you in the application and on community leaderboards.</li>
          <li><strong>Email Address:</strong> Used for account authentication, password resets, and critical account notices.</li>
          <li><strong>Password (Cryptographically Hashed):</strong> Scrambled using bcrypt before saving. We never store or view your plain-text password.</li>
          <li><strong>Learning Progress & Quiz Answers:</strong> Completed missions, score percentages, and spaced repetition flashcard timings to schedule review decks.</li>
          <li><strong>Device & Browser Type:</strong> Basic technical headers used solely to maintain interface compatibility and prevent automated bot abuse.</li>
          <li><strong>Session Cookies:</strong> A secure authentication token (<code className="text-indigo-300">chaptr_token</code>) to keep you signed in. No advertising cookies are ever used.</li>
        </ul>
        <p className="text-xs text-slate-400 pt-1">
          For full details, please review our{" "}
          <Link to="/privacy" className="text-indigo-400 font-semibold underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    category: "Privacy & Data",
    question: "Do you sell user data or show third-party ads?",
    answer: (
      <p>
        <strong>No, never.</strong> {APP_NAME} does not sell, license, or monetize your reading history or personal data to data brokers, advertising networks, or external marketing agencies. The platform contains zero third-party advertising banners and zero tracking pixels.
      </p>
    ),
  },
  {
    category: "Privacy & Data",
    question: "How do I export or delete all my account data?",
    answer: (
      <p>
        Under India's Digital Personal Data Protection Act (DPDP Act, 2023) and global privacy regulations, you have the sovereign right to erasure. Email us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-400 font-semibold underline">
          {SUPPORT_EMAIL}
        </a>{" "}
        with the subject "Delete My Account," and we will permanently wipe your account and learning records from our production databases within 30 days.
      </p>
    ),
  },
  {
    category: "Learning System",
    question: "How does the Spaced Repetition (SM-2) system work?",
    answer: (
      <p>
        When you complete an interactive mission, questions are indexed into your personal review schedule. Rather than cramming once and forgetting 80% within two weeks, our SM-2 algorithm schedules quick recall sessions right before a concept fades from memory (1 day, 3 days, 1 week, 1 month). A 3-minute daily review locks insights into permanent long-term memory.
      </p>
    ),
  },
  {
    category: "Learning System",
    question: `What is ${MASCOT_NAME} the AI Tutor, and is it accurate?`,
    answer: (
      <p>
        {MASCOT_NAME} is our friendly study companion trained to break down complex philosophical and non-fiction ideas into memorable real-world analogies, explain why a particular quiz option was correct, and answer your follow-up questions. While grounded in non-fiction source material, {MASCOT_NAME} is an educational study aid and should not replace certified professional legal or medical advice.
      </p>
    ),
  },
  {
    category: "Books & Copyright",
    question: "Are the books in the library copyright-compliant?",
    answer: (
      <p>
        <strong>Yes, 100%.</strong> Our library strictly features public domain literary classics (whose authors died over 95 years ago, putting them safely in the public domain worldwide) and our own original educational curricula. Our mission lessons and interactive quizzes are original educational analyses crafted to teach the core ideas. We do not host or distribute pirated copyrighted texts.
      </p>
    ),
  },
  {
    category: "Account & Pricing",
    question: `Is ${APP_NAME} really completely free?`,
    answer: (
      <p>
        <strong>Yes.</strong> All 100+ books, 500+ interactive missions, spaced repetition decks, community leaderboards, and AI study tutor features are free of charge. No credit card is requested during signup, and there are no surprise fees or paywalls.
      </p>
    ),
  },
  {
    category: "Account & Pricing",
    question: "What happens if I lose my daily learning streak?",
    answer: (
      <p>
        Your streak represents consecutive days with at least one completed mission or review card session before midnight in your local timezone. If you miss a day, your streak resets, but all your accumulated XP points, mastered books, and knowledge levels remain permanently saved to your profile!
      </p>
    ),
  },
];

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const categories = ["all", "Privacy & Data", "Learning System", "Books & Copyright", "Account & Pricing"];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === "string" && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-200">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <div className="text-xs text-slate-400">
          Knowledge Base & Help
        </div>
      </div>

      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle size={14} />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          How {APP_NAME} Works
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Everything you need to know about our privacy policies, data collection, learning science, and copyright standards.
        </p>

        {/* Search Input */}
        <div className="pt-2 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. data, streak, free)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-[#131A2E] text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-semibold transition-colors ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-[#131A2E] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {cat === "all" ? "All Questions" : cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#131A2E] border border-slate-800 text-slate-400 text-sm">
            No questions matching "{searchQuery}". Have a question not listed here? Email us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-400 underline font-semibold">
              {SUPPORT_EMAIL}
            </a>
            .
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openItems[idx] ?? false;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-[#131A2E] border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-slate-800/80 text-slate-300 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Need more help banner */}
      <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display font-bold text-base text-white">
            Have a suggestion or found an error?
          </h3>
          <p className="text-xs text-slate-300">
            We review every bug report, feature request, and book curriculum feedback.
          </p>
        </div>
        <Link
          to="/feedback"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xs transition-colors shrink-0 shadow-md"
        >
          Submit Bug or Suggestion
        </Link>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
        <Link to="/terms" className="hover:text-indigo-400">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/privacy" className="hover:text-indigo-400">Privacy Policy</Link>
        <span>•</span>
        <Link to="/cookies" className="hover:text-indigo-400">Cookie Policy</Link>
        <span>•</span>
        <Link to="/refund" className="hover:text-indigo-400">Refund Policy</Link>
        <span>•</span>
        <Link to="/feedback" className="hover:text-indigo-400">Bug Report & Feedback</Link>
      </div>
    </div>
  );
};
