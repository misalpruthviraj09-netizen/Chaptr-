import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Scale, BookOpen, Mail, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { APP_NAME, MASCOT_NAME, SUPPORT_EMAIL, LEGAL_NAME, JURISDICTION, LAST_LEGAL_UPDATE } from "../config/brand";

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
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

        {/* Page Header */}
        <div className="bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Scale size={14} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Terms and Conditions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Please read these Terms and Conditions ("Terms") carefully before using {APP_NAME} (operated by {LEGAL_NAME}), including our web applications, interactive missions, and learning services.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-400 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              100% Free Core Learning Access
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              Transparent Terms & No Dark Patterns
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <BookOpen size={14} className="text-emerald-400" />
              Public Domain Classics & Original Content
            </span>
          </div>
        </div>

        {/* Legal Body Sections */}
        <div className="bg-[#131A2E] rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">01.</span>
              Acceptance of Terms & Eligibility
            </h2>
            <p>
              By accessing, browsing, registering for, or using {APP_NAME} ("Service", "we", "us", or "our"), you ("User", "Scholar", or "you") agree to be bound by these Terms and our Privacy Policy. If you do not agree to all terms herein, you must discontinue using {APP_NAME} immediately.
            </p>
            <p>
              <strong>Eligibility Criteria:</strong> You must be at least 13 years old (or the applicable digital age of consent in your country) to create an account. If you are under 18 years of age, you confirm that your parent or legal guardian has reviewed and agreed to these Terms on your behalf. Each individual is permitted one active personal account.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">02.</span>
              Description of the Service & Tiers
            </h2>
            <p>
              {APP_NAME} provides an interactive non-fiction learning platform that transforms literary and practical masterworks into bite-sized missions, active retrieval challenges, spaced repetition review decks (powered by the SM-2 algorithm), and gamified habit-tracking mechanics.
            </p>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="font-semibold text-white text-xs uppercase tracking-wider">
                Service Tiers:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                <li><strong>Free Scholar Tier:</strong> Complete access to our full library of 100+ books, 500+ interactive missions, personal review flashcard decks, leaderboard participation, and the {MASCOT_NAME} AI study tutor. Zero cost, no credit card required.</li>
                <li><strong>Optional Premium Tiers:</strong> Any future optional premium enhancements (such as cohort masterminds or personalized offline audio exports) will be clearly disclosed with upfront pricing, billing intervals, and simple one-click cancellation before any charge is initiated.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">03.</span>
              Acceptable Use & Anti-Scraping Policy
            </h2>
            <p>
              You agree to use {APP_NAME} strictly for legitimate, lawful, and personal educational purposes. You agree NOT to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Scrape, crawl, harvest, or extract lesson texts, quiz questions, or database records using automated bots or headless browsers without written authorization.</li>
              <li>Reverse-engineer, decompile, or disassemble any part of the {APP_NAME} application, client scripts, or backend APIs.</li>
              <li>Share account credentials or session tokens with multiple individuals to circumvent system limits.</li>
              <li>Manipulate learning metrics, farm XP points with scripts, or submit fabricated mission answers to fraudulently influence community leaderboards.</li>
              <li>Use vulgar, harassing, defamatory, or abusive language in user profiles, review comments, or feedback forms.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">04.</span>
              Intellectual Property & Content Licensing Disclosure
            </h2>
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
              <p className="font-semibold text-indigo-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>Explicit Content Licensing Disclosure</span>
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                "We use public-domain works and original educational content. We do not use copyrighted books without a licensing agreement."
              </p>
            </div>
            <p>
              <strong>Original Pedagogy & Software:</strong> The {APP_NAME} name, brand identity, mascot ({MASCOT_NAME}), user interface designs, mission texts, question banks, codebases, and review card algorithms are the exclusive intellectual property of {LEGAL_NAME}.
            </p>
            <p>
              <strong>Public Domain Classics:</strong> Books identified as public domain are based solely on literary works whose authors passed away over 95 years ago, rendering the underlying works free of copyright restrictions in India, the United States, and worldwide. Our original mission lessons and pedagogic exercises are independently written educational analyses.
            </p>
            <p>
              You are granted a limited, personal, revocable, non-exclusive, non-transferable license to access our educational content for personal learning only.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">05.</span>
              AI Study Companion ({MASCOT_NAME} AI Tutor)
            </h2>
            <p>
              {APP_NAME} includes "{MASCOT_NAME}," an interactive AI study companion:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Supplemental Educational Aid:</strong> {MASCOT_NAME} is intended purely to aid understanding and retention. Its answers do not constitute certified legal, medical, psychological, or financial investment advice.</li>
              <li><strong>Independent Verification:</strong> Generative AI models may occasionally produce imperfect or outdated analogies. Users are encouraged to think critically and verify factual claims against primary texts.</li>
              <li><strong>Safe Usage:</strong> You agree not to submit prompts designed to generate illegal, hateful, malicious, or deceptive content.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">06.</span>
              Account Termination & Suspension
            </h2>
            <p>
              <strong>Termination by You:</strong> You may close your account and request complete data erasure at any time by contacting {SUPPORT_EMAIL}.
            </p>
            <p>
              <strong>Termination by Us:</strong> We reserve the right to suspend or terminate access to {APP_NAME} immediately, without prior notice, if you breach these Terms (including automated leaderboard scraping, account sharing, or security tampering).
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">07.</span>
              Limitation of Liability & "As Is" Disclaimer
            </h2>
            <p>
              {APP_NAME} is provided on an "as is" and "as available" basis without express or implied warranties of any kind. To the fullest extent permitted by applicable law, neither {LEGAL_NAME} nor its contributors shall be liable for indirect, incidental, punitive, or consequential damages resulting from your use of, or inability to use, the platform.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">08.</span>
              Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms shall be governed by, construed, and enforced in accordance with the laws of <strong>{JURISDICTION}</strong>, without regard to conflict-of-law principles. Any legal dispute or claim arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts of India.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">09.</span>
              Modifications to Terms
            </h2>
            <p>
              We may update these Terms from time to time. When updates occur, the "Last Updated" date at the top of this document will be revised. Continued use of {APP_NAME} after revised Terms are posted constitutes binding acceptance of the changes.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 border-t border-slate-800 pt-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-base">10.</span>
              Contact Information
            </h2>
            <p className="text-xs text-slate-300">
              For legal inquiries, copyright notices, or account assistance:
            </p>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Mail className="text-indigo-400 shrink-0" size={20} />
              <div>
                <p className="text-xs font-semibold text-white">{APP_NAME} Legal & Support</p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-400 justify-between items-center">
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Back to {APP_NAME} Home</Link>
          <div className="flex flex-wrap gap-3">
            <Link to="/privacy" className="hover:text-indigo-400">Privacy Policy</Link>
            <span>•</span>
            <Link to="/cookies" className="hover:text-indigo-400">Cookie Policy</Link>
            <span>•</span>
            <Link to="/refund" className="hover:text-indigo-400">Refund Policy</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-indigo-400">FAQ</Link>
            <span>•</span>
            <Link to="/feedback" className="hover:text-indigo-400">Bug Report & Feedback</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
