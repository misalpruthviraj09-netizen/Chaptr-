import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME, TAGLINE, SUPPORT_EMAIL, LEGAL_NAME, BUSINESS_LOCATION } from "../../config/brand";
import { Logo } from "../brand/Logo";
import { Mail, ShieldCheck, Settings2, Bug } from "lucide-react";
import { openCookiePreferencesModal } from "../../services/cookieConsent";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#080C18] text-slate-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-800/80">
        {/* Brand identity */}
        <div className="space-y-2 text-center md:text-left">
          <Logo size="md" />
          <p className="font-display font-medium text-slate-300 text-sm">
            {TAGLINE}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Public-domain classics & original educational curriculum.</span>
          </div>
        </div>

        {/* Clean Essential Links */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-xs font-semibold text-slate-300">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/terms"
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              to="/refund"
              className="hover:text-white transition-colors"
            >
              Refund Policy
            </Link>
            <Link
              to="/faq"
              className="hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/feedback"
              className="hover:text-white text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <Bug size={14} />
              <span>Bug Report & Ideas</span>
            </Link>
          </div>

          {/* Email badge */}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-all font-mono text-xs"
          >
            <Mail size={14} />
            <span>{SUPPORT_EMAIL}</span>
          </a>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>
          © {new Date().getFullYear()} {LEGAL_NAME} ({BUSINESS_LOCATION}). All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openCookiePreferencesModal}
            className="hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Settings2 size={13} />
            <span>Cookie Preferences</span>
          </button>
          <span>•</span>
          <span>Engineered for lifelong scholars</span>
        </div>
      </div>
    </footer>
  );
};
