import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Cookie, Settings2, Check, Lock, BookOpen, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import {
  getStoredCookiePreferences,
  saveCookiePreferences,
  CookiePreferences,
} from "../../services/cookieConsent";
import { APP_NAME, MASCOT_NAME, LEGAL_NAME, LAST_LEGAL_UPDATE } from "../../config/brand";
import { Pip } from "../brand/Pip";

export const CookieConsentBanner: React.FC = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [hasConsented, setHasConsented] = useState<boolean>(true); // Default true until checked
  const [showManageModal, setShowManageModal] = useState<boolean>(false);
  const [showDetailsDropdown, setShowDetailsDropdown] = useState<boolean>(false);

  // Granular toggles
  const [functionalToggle, setFunctionalToggle] = useState<boolean>(true);
  const [analyticsToggle, setAnalyticsToggle] = useState<boolean>(false);

  const location = useLocation();

  // Allow unrestricted viewing of pure legal pages (/privacy, /terms, /cookies, /refund)
  // so the user can read the full documents before accepting if they wish!
  const isDirectLegalPage = [
    "/privacy",
    "/terms",
    "/cookies",
    "/refund",
    "/faq",
  ].includes(location.pathname);

  useEffect(() => {
    const existing = getStoredCookiePreferences();
    if (existing) {
      setPreferences(existing);
      setFunctionalToggle(existing.functional);
      setAnalyticsToggle(existing.analytics);
      setHasConsented(true);
    } else {
      setHasConsented(false);
    }

    const handleOpenModal = () => {
      const current = getStoredCookiePreferences();
      if (current) {
        setFunctionalToggle(current.functional);
        setAnalyticsToggle(current.analytics);
      }
      setShowManageModal(true);
    };

    window.addEventListener("chaptr-open-cookie-modal", handleOpenModal);
    return () => {
      window.removeEventListener("chaptr-open-cookie-modal", handleOpenModal);
    };
  }, []);

  const handleAcceptAll = () => {
    const updated = saveCookiePreferences({ functional: true, analytics: true });
    setPreferences(updated);
    setHasConsented(true);
    setShowManageModal(false);
  };

  const handleAcceptEssentialOnly = () => {
    const updated = saveCookiePreferences({ functional: false, analytics: false });
    setPreferences(updated);
    setHasConsented(true);
    setShowManageModal(false);
  };

  const handleSaveCustomPreferences = () => {
    const updated = saveCookiePreferences({
      functional: functionalToggle,
      analytics: analyticsToggle,
    });
    setPreferences(updated);
    setHasConsented(true);
    setShowManageModal(false);
  };

  // If user has not consented, show the blocking Entry Gate
  const showBlockingGate = !hasConsented;

  return (
    <>
      {/* 1. MANDATORY ENTRY GATE (BLOCKS SITE INTERACTION UNTIL ACCEPTED) */}
      {showBlockingGate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="entry-gate-title"
          className="fixed inset-0 z-99999 flex items-center justify-center p-4 sm:p-6 bg-[#060A14]/90 backdrop-blur-xl overflow-y-auto"
        >
          <div className="w-full max-w-xl rounded-3xl bg-[#131A2E] border-2 border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Mascot and Header */}
            <div className="flex items-center gap-4 border-b border-slate-800/80 pb-5">
              <div className="shrink-0 p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <ShieldCheck size={32} className="text-indigo-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Mandatory Privacy Gate
                  </span>
                  <span className="text-xs text-slate-400">
                    {APP_NAME} by {LEGAL_NAME}
                  </span>
                </div>
                <h2 id="entry-gate-title" className="font-display font-bold text-xl sm:text-2xl text-white">
                  Consent Required to Enter {APP_NAME}
                </h2>
              </div>
            </div>

            {/* Core Message */}
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>
                To provide you with secure learning sessions, track your habit streaks, and power the SM-2 spaced repetition review algorithm, we require your explicit agreement to our <strong>Privacy Policy</strong> and <strong>Cookie Terms</strong> before accessing the platform.
              </p>

              {/* Guarantees Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>No 3rd-party ad trackers or pixels</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Zero data sales to brokers</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Passwords cryptographically hashed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Full account erasure on request</span>
                </div>
              </div>
            </div>

            {/* Legal Document Links */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  <span>Review Our Legal Policies</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Updated: {LAST_LEGAL_UPDATE}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <Link
                  to="/privacy"
                  target="_blank"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 inline-flex items-center gap-1"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink size={11} />
                </Link>
                <Link
                  to="/terms"
                  target="_blank"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 inline-flex items-center gap-1"
                >
                  <span>Terms and Conditions</span>
                  <ExternalLink size={11} />
                </Link>
                <Link
                  to="/cookies"
                  target="_blank"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 inline-flex items-center gap-1"
                >
                  <span>Cookie Policy</span>
                  <ExternalLink size={11} />
                </Link>
              </div>
            </div>

            {/* Granular Details Dropdown Toggle */}
            <div className="border-t border-slate-800/80 pt-3">
              <button
                type="button"
                onClick={() => setShowDetailsDropdown(!showDetailsDropdown)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1"
              >
                <span>Customize cookie preferences (Functional & Analytics)</span>
                {showDetailsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showDetailsDropdown && (
                <div className="mt-3 space-y-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                  {/* Essential */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Strictly Necessary Cookies</p>
                      <p className="text-slate-400 text-[11px]">Authentication session and security tokens. Required.</p>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Locked
                    </span>
                  </div>

                  {/* Functional */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <p className="font-semibold text-white">Functional Preferences</p>
                      <p className="text-slate-400 text-[11px]">Audio effects and study interface layout preferences.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={functionalToggle}
                      onChange={(e) => setFunctionalToggle(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <p className="font-semibold text-white">Anonymous Diagnostics</p>
                      <p className="text-slate-400 text-[11px]">Aggregated platform telemetry to resolve bugs.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={analyticsToggle}
                      onChange={(e) => setAnalyticsToggle(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Entry Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {showDetailsDropdown ? (
                <button
                  type="button"
                  onClick={handleSaveCustomPreferences}
                  className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  <span>Save Preferences & Enter Chaptr</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-sm transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    <span>Accept All & Enter Chaptr</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptEssentialOnly}
                    className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-display font-semibold text-xs transition-colors text-center"
                  >
                    Accept Essential Only
                  </button>
                </>
              )}
            </div>

            <p className="text-[11px] text-center text-slate-400">
              By clicking "Accept", you confirm you have read and agree to our Terms and Conditions and Privacy Policy. You can adjust your preferences anytime via the footer.
            </p>
          </div>
        </div>
      )}

      {/* 2. RE-OPENED PREFERENCES MODAL (WHEN TRIGGERED VIA FOOTER LINK) */}
      {showManageModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#131A2E] border border-slate-700 p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Settings2 size={20} />
                </div>
                <div>
                  <h3 id="cookie-settings-title" className="font-display font-bold text-lg text-white">
                    Cookie & Storage Preferences
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customize which cookies and local storage tokens we use
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close preferences"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {/* Strictly Necessary */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <h4 className="font-display font-semibold text-sm text-white">
                      Strictly Necessary (Essential)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Always Active
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Required for user authentication (<code className="text-slate-200">chaptr_token</code>), session security, and interface dark mode. These cannot be disabled.
                </p>
              </div>

              {/* Functional */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">
                      Functional & User Experience
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      Audio effects, playback speed, and study layout preferences.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={functionalToggle}
                    onChange={(e) => setFunctionalToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">
                      Anonymous Analytics & Performance
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      Aggregated telemetry to measure mission completion and prevent bugs.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsToggle}
                    onChange={(e) => setAnalyticsToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomPreferences}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xs transition-colors shadow-md flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Save Choices</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
