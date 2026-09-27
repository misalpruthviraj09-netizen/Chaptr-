import React from "react";
import { Link } from "react-router-dom";
import { Cookie, ShieldCheck, Settings2, Lock, ArrowLeft } from "lucide-react";
import { APP_NAME, LAST_LEGAL_UPDATE, SUPPORT_EMAIL } from "../config/brand";
import { openCookiePreferencesModal } from "../services/cookieConsent";

export const CookiePolicyPage: React.FC = () => {
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
          Last Updated: <span className="text-slate-200 font-medium">{LAST_LEGAL_UPDATE}</span>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Cookie size={14} />
          <span>Transparent Technology</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Cookie & Storage Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Learn how {APP_NAME} uses cookies, local browser storage tokens, and session identifiers to deliver a fast, secure, and personalized learning experience.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={openCookiePreferencesModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <Settings2 size={16} />
            <span>Manage My Cookie Preferences</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            1. What Are Cookies and Local Storage?
          </h2>
          <p>
            Cookies are tiny text files stored on your computer or mobile device when you visit a website. Modern web applications also use <strong>Local Storage</strong>, which allows your browser to remember information locally without sending it with every single network request.
          </p>
          <p>
            At {APP_NAME}, we use cookies and browser storage strictly to keep you authenticated, remember your interface settings, and track your educational progress.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-xl text-white">
            2. Categories of Cookies We Use
          </h2>
          <div className="space-y-4">
            {/* Strictly Necessary */}
            <div className="p-5 rounded-2xl bg-[#131A2E] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <h3 className="font-display font-bold text-base text-white">
                    A. Strictly Necessary (Essential)
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Required / Cannot Be Disabled
                </span>
              </div>
              <p className="text-xs text-slate-400">
                These are vital for you to log in, browse securely, and navigate our learning missions. Without these, authentication fails.
              </p>
              <div className="pt-2 overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-900/80 text-slate-200">
                    <tr>
                      <th className="p-2.5">Key / Name</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Purpose</th>
                      <th className="p-2.5">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-400">
                    <tr>
                      <td className="p-2.5 font-mono text-slate-200">chaptr_token</td>
                      <td className="p-2.5">LocalStorage</td>
                      <td className="p-2.5">JSON Web Token maintaining your secure login session</td>
                      <td className="p-2.5">7 days / Until sign-out</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-200">chaptr_theme</td>
                      <td className="p-2.5">LocalStorage</td>
                      <td className="p-2.5">Stores dark visual theme preference</td>
                      <td className="p-2.5">Persistent</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-slate-200">chaptr_cookie_preferences</td>
                      <td className="p-2.5">LocalStorage</td>
                      <td className="p-2.5">Stores your cookie consent choices</td>
                      <td className="p-2.5">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Functional */}
            <div className="p-5 rounded-2xl bg-[#131A2E] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white">
                  B. Functional & User Experience
                </h3>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Optional
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enhance your experience by remembering sound effects preferences, audio speeds, and in-progress question drafts.
              </p>
            </div>

            {/* Analytics */}
            <div className="p-5 rounded-2xl bg-[#131A2E] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white">
                  C. Anonymous Analytics & Diagnostics
                </h3>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Optional
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Measures aggregated mission completion rates and platform response times to diagnose application bottlenecks.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
          <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Lock size={16} className="text-indigo-400" />
            <span>Zero Third-Party Advertising Cookies</span>
          </h2>
          <p className="text-xs text-slate-300">
            We confirm explicitly that {APP_NAME} does <strong>NOT</strong> use third-party advertising cookies, cross-site trackers, or behavioral profiling scripts. We never sell your viewing or learning history to data brokers.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            3. How to Manage or Withdraw Consent
          </h2>
          <p>
            You can change your cookie preferences at any time by clicking the{" "}
            <button
              type="button"
              onClick={openCookiePreferencesModal}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
            >
              Manage My Cookie Preferences
            </button>{" "}
            button or through your web browser's native settings (which allow you to clear all cookies and site data whenever you choose).
          </p>
          <p>
            For further information on how we handle personal data, please review our comprehensive{" "}
            <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
        <Link to="/terms" className="hover:text-indigo-400">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/privacy" className="hover:text-indigo-400">Privacy Policy</Link>
        <span>•</span>
        <Link to="/refund" className="hover:text-indigo-400">Refund Policy</Link>
        <span>•</span>
        <Link to="/faq" className="hover:text-indigo-400">FAQ</Link>
        <span>•</span>
        <Link to="/feedback" className="hover:text-indigo-400">Bug Report & Feedback</Link>
      </div>
    </div>
  );
};
