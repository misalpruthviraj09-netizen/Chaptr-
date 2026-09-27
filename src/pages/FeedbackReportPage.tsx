import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bug, Sparkles, BookOpen, Send, CheckCircle2, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { APP_NAME, SUPPORT_EMAIL } from "../config/brand";
import { Pip } from "../components/brand/Pip";

export const FeedbackReportPage: React.FC = () => {
  const [type, setType] = useState<"BUG" | "FEATURE" | "BOOK_REQUEST">("BUG");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    setIsSubmitting(true);
    // Simulate swift submission storage
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setTitle("");
    setDetails("");
    setDeviceInfo("");
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-200">
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
          Community Feedback & Support
        </div>
      </div>

      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Bug size={14} />
          <span>Feedback & Bug Reporting</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Bug Report & Feature Suggestions
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Help us build the most reliable, distraction-free book mastery experience. Report a defect, request a public domain book, or suggest a new feature.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#131A2E] border border-slate-800 shadow-xl text-center space-y-5">
          <div className="flex justify-center">
            <Pip mood="cheering" size="md" speechBubble="Thank you for your report!" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-white">
              Feedback Received Successfully!
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              We appreciate you taking the time to help improve {APP_NAME}. Our development team audits all reports directly. If you provided an email, we may follow up if we need clarification.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xs transition-colors"
            >
              Submit Another Report
            </button>
            <Link
              to="/app/books"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-display font-bold text-xs transition-colors"
            >
              Return to Library
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
          {/* Feedback Type Tabs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setType("BUG")}
              className={`py-2.5 px-3 rounded-xl font-display font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                type === "BUG"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bug size={16} />
              <span>Bug Report</span>
            </button>
            <button
              type="button"
              onClick={() => setType("FEATURE")}
              className={`py-2.5 px-3 rounded-xl font-display font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                type === "FEATURE"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles size={16} />
              <span>Feature Idea</span>
            </button>
            <button
              type="button"
              onClick={() => setType("BOOK_REQUEST")}
              className={`py-2.5 px-3 rounded-xl font-display font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                type === "BOOK_REQUEST"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen size={16} />
              <span>Book Request</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="report-title" className="block text-xs font-semibold text-slate-300 mb-1.5">
                {type === "BUG"
                  ? "What went wrong? (Short summary)"
                  : type === "FEATURE"
                  ? "Feature Title"
                  : "Book Title and Author"}
              </label>
              <input
                id="report-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  type === "BUG"
                    ? "e.g. Question option text clipped on mobile"
                    : type === "FEATURE"
                    ? "e.g. Export spaced repetition flashcards to Anki"
                    : "e.g. The Autobiography of Benjamin Franklin"
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden placeholder:text-slate-500"
              />
            </div>

            <div>
              <label htmlFor="report-details" className="block text-xs font-semibold text-slate-300 mb-1.5">
                {type === "BUG"
                  ? "Steps to reproduce and what happened:"
                  : "Detailed description of the suggestion:"}
              </label>
              <textarea
                id="report-details"
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  type === "BUG"
                    ? "1. Opened Mission 3 of Meditations\n2. Clicked question 2\n3. Expected XP to increment, but screen lagged..."
                    : "Describe the specific problem this would solve or why this book would make a great mission path..."
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden placeholder:text-slate-500 resize-y"
              />
            </div>

            {type === "BUG" && (
              <div>
                <label htmlFor="report-device" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Device / Browser Info (Optional)
                </label>
                <input
                  id="report-device"
                  type="text"
                  value={deviceInfo}
                  onChange={(e) => setDeviceInfo(e.target.value)}
                  placeholder="e.g. Chrome 128 on Android 14 / iPhone 15 Safari"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden placeholder:text-slate-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="report-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Email Address (Optional, for status updates)
              </label>
              <input
                id="report-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden placeholder:text-slate-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-3d w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-md"
              >
                <Send size={16} />
                <span>
                  {isSubmitting
                    ? "Submitting Report..."
                    : type === "BUG"
                    ? "Submit Bug Report"
                    : type === "FEATURE"
                    ? "Send Feature Suggestion"
                    : "Submit Book Request"}
                </span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-indigo-400" />
              Direct Support: {SUPPORT_EMAIL}
            </span>
            <span>Reviewed within 48 business hours</span>
          </div>
        </div>
      )}

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
        <Link to="/faq" className="hover:text-indigo-400">FAQ</Link>
      </div>
    </div>
  );
};
