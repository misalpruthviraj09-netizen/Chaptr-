import React from "react";
import { Link } from "react-router-dom";
import { RefreshCcw, ShieldCheck, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { APP_NAME, LEGAL_NAME, SUPPORT_EMAIL, JURISDICTION, LAST_LEGAL_UPDATE } from "../config/brand";

export const RefundPolicyPage: React.FC = () => {
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
          <RefreshCcw size={14} />
          <span>Consumer Protection & Billing</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Cancellation & Refund Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Clear, honest, and straightforward terms regarding service tiers, cancellations, and refund eligibility under the Consumer Protection (E-Commerce) Rules, 2020.
        </p>
      </div>

      {/* Status Highlights */}
      <div className="p-6 rounded-3xl bg-[#131A2E] border border-slate-800 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-white">
              Current Core Service: 100% Free
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All books, interactive learning missions, spaced repetition decks, community leaderboards, and {APP_NAME}'s AI study tutor are currently provided entirely free. No credit card is required to sign up, and no recurring fees exist for basic usage.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Details */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            1. Paid Services & Future Premium Subscriptions
          </h2>
          <p>
            Should {APP_NAME} introduce optional paid tiers, cohort masterminds, or certified completion certificates in the future:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>One-Click Cancellation Anytime:</strong> You may cancel any future recurring subscription at any time directly through your account settings. Upon cancellation, you retain access until the end of your current paid billing period, and no further renewals will be billed.
            </li>
            <li>
              <strong>Billing Period Policy:</strong> Except as required by consumer protection laws, subscription payments are non-refundable for partial months or unused periods once access has been provisioned.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            2. Duplicate or Erroneous Transactions
          </h2>
          <p>
            In the event of a technical billing error, duplicate transaction, or unauthorized charge caused by payment gateway disruption:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>100% Full Refund:</strong> We will issue a 100% full refund for the duplicate or erroneous charge immediately upon verification.
            </li>
            <li>
              <strong>Resolution Timeframe:</strong> Please notify us within 14 days of the charge. We will acknowledge your request within 48 hours, and refunds will be credited back to your original payment method within 5 to 7 business days.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            3. Ineligibility for Refunds (Terms Violations)
          </h2>
          <p>
            No refunds or credits shall be issued to users whose accounts are suspended or terminated as a result of:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Automated data scraping or bot tampering with platform quizzes and leaderboards.</li>
            <li>Reverse engineering or attacking application infrastructure.</li>
            <li>Harassment, abusive behavior, or severe violations of our Terms and Conditions.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            4. How to Request a Refund
          </h2>
          <p>
            To submit a refund or billing question, send an email from your registered account email to:
          </p>
          <div className="p-4 rounded-2xl bg-[#131A2E] border border-slate-800 flex items-center gap-3">
            <Mail className="text-indigo-400 shrink-0" size={20} />
            <div>
              <p className="text-xs font-semibold text-white">Billing & Customer Support</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Please include: (1) Your registered email, (2) Transaction ID or date of charge, and (3) Brief description of the issue.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h2 className="font-display font-bold text-base text-white">
            5. Consumer Protection (E-Commerce) Rules, 2020 Compliance
          </h2>
          <p className="text-xs text-slate-300">
            In accordance with the Consumer Protection (E-Commerce) Rules, 2020 of {JURISDICTION}, {LEGAL_NAME} commits to transparent upfront pricing with zero concealed fees. Our Grievance Officer oversees all billing grievances, ensuring fair and prompt resolution.
          </p>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
        <Link to="/terms" className="hover:text-indigo-400">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/privacy" className="hover:text-indigo-400">Privacy Policy</Link>
        <span>•</span>
        <Link to="/cookies" className="hover:text-indigo-400">Cookie Policy</Link>
        <span>•</span>
        <Link to="/faq" className="hover:text-indigo-400">FAQ</Link>
        <span>•</span>
        <Link to="/feedback" className="hover:text-indigo-400">Bug Report & Feedback</Link>
      </div>
    </div>
  );
};
