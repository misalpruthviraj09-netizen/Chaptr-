import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, Server, RefreshCw, FileText, Mail, AlertTriangle } from "lucide-react";
import { APP_NAME, SUPPORT_EMAIL, LEGAL_NAME, BUSINESS_LOCATION, JURISDICTION, GRIEVANCE_EMAIL, LAST_LEGAL_UPDATE } from "../config/brand";

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
          <ShieldCheck size={14} />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm">
          Last Updated: <span className="text-slate-200 font-medium">{LAST_LEGAL_UPDATE}</span> • Effective Date: {LAST_LEGAL_UPDATE}
        </p>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          At {APP_NAME} (operated by {LEGAL_NAME}), we respect your privacy and believe in total transparency. This Privacy Policy details the exact personal data we collect, why we need it, how it is safeguarded, and your sovereign rights regarding your information under the Digital Personal Data Protection Act, 2023 (DPDP Act) and international data standards.
        </p>
      </div>

      {/* Quick Transparency Summary Card */}
      <section className="p-6 rounded-3xl bg-[#131A2E] border border-indigo-500/20 shadow-lg space-y-4">
        <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <Eye size={18} className="text-indigo-400" />
          <span>Quick Summary: What Data Does {APP_NAME} Collect?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-100 block">1. Account Data</span>
            <p className="text-slate-400">Your display name, email address, and cryptographically hashed passwords. We never store plain-text passwords.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-100 block">2. Learning Progress</span>
            <p className="text-slate-400">Missions completed, quiz responses, correct answer ratios, review card schedules, XP points, and streak counters.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-100 block">3. Technical & Browser Data</span>
            <p className="text-slate-400">Browser type, device classification, operating system, and IP address solely for security and fraud prevention.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-100 block">4. Strictly Necessary Cookies</span>
            <p className="text-slate-400">Authentication tokens (<code className="text-slate-200">chaptr_token</code>) and visual theme preferences. No ad trackers.</p>
          </div>
        </div>
      </section>

      {/* Main Legal Clauses */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            1. Why We Collect Your Data
          </h2>
          <p>
            We process your personal information only when we have a valid lawful basis (specifically, your explicit consent upon registration and our legitimate interest in providing a secure service). Your information is used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Authenticate your account and maintain session security across visits.</li>
            <li>Power the SM-2 spaced repetition engine to deliver questions at optimal recall intervals.</li>
            <li>Maintain your learning streak, calculate community XP tiers, and award verified badges.</li>
            <li>Provide prompt customer support and resolve user-reported technical issues.</li>
            <li>Protect our systems against malicious bots, automated scraping, and unauthorized intrusions.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            2. How Data Is Stored & Safeguarded
          </h2>
          <p>
            Security is engineered directly into {APP_NAME}'s architecture:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Encrypted Transport:</strong> All data transmitted between your browser and our servers is encrypted in transit using industry-standard TLS/HTTPS protocols.</li>
            <li><strong>Password Protection:</strong> Passwords are one-way hashed using bcrypt with salt rounds before storage. We cannot view or recover your raw password.</li>
            <li><strong>Data Retention:</strong> We store your account and learning records for as long as your account remains active. Upon your request for account deletion, all personal data is permanently wiped from our primary databases within 30 days.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            3. Third-Party Services We Actually Use
          </h2>
          <p>
            We do not sell, rent, or monetize your personal data. We engage only trusted third-party technical providers strictly necessary for delivering the application:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-2xl overflow-hidden">
              <thead className="bg-slate-900/80 text-white font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Service Provider</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Data Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-medium text-white">Google Fonts</td>
                  <td className="p-3">Typography asset delivery (Fredoka & Inter)</td>
                  <td className="p-3 text-slate-400">IP address & browser header to serve font files</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Google Identity Services</td>
                  <td className="p-3">Optional OAuth 2.0 social login</td>
                  <td className="p-3 text-slate-400">OAuth verification token when user chooses Google Sign-In</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Cloud Hosting Infrastructure</td>
                  <td className="p-3">Backend application and database hosting</td>
                  <td className="p-3 text-slate-400">Application requests and database records stored securely</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400">
            <strong>Important:</strong> We do NOT load any third-party behavioral advertising scripts, tracking pixels (such as Meta Pixel or TikTok Pixel), or data broker SDKs.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            4. Your Rights Under India's DPDP Act, 2023 & Global Standards
          </h2>
          <p>
            You possess full control over your digital identity. Under the Digital Personal Data Protection Act, 2023 (DPDP Act) and international data frameworks, you have:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li><strong>Right to Access:</strong> Request a complete summary of the personal data we hold about you.</li>
            <li><strong>Right to Correction:</strong> Request immediate correction of inaccurate or outdated personal details.</li>
            <li><strong>Right to Erasure (Account Deletion):</strong> Request the permanent deletion of your account, learning history, and progress metrics.</li>
            <li><strong>Right to Grievance Redressal:</strong> Submit a complaint regarding our data practices to our Grievance Officer, with guaranteed review within 30 days.</li>
            <li><strong>Right to Nominate:</strong> Nominate another individual to exercise your data rights in the event of death or incapacity.</li>
          </ul>
          <p>
            To exercise any of these rights, email us directly at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
              {SUPPORT_EMAIL}
            </a>{" "}
            with the subject line "Data Subject Request".
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            5. Children's Privacy
          </h2>
          <p>
            {APP_NAME} is intended for high school, university, and adult lifelong learners. The platform is not directed at children under the age of 13 (or under 18 without verifiable parental consent under the DPDP Act). We do not knowingly collect personal information from minors. If you believe a child has provided us with personal data without guardian consent, please contact us immediately at {SUPPORT_EMAIL}, and we will purge the account promptly.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            6. Data Breach Protocol
          </h2>
          <p>
            While no digital service can guarantee absolute invulnerability, we implement defense-in-depth protections. In the unlikely event of a security incident that impacts personal data integrity or confidentiality, we will notify affected users via email and notify relevant regulatory authorities in compliance with applicable law without undue delay.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-white">
            7. International Users
          </h2>
          <p>
            {APP_NAME} is developed and governed under the laws of {JURISDICTION}. If you access our services from the European Union, the United Kingdom, the United States, or other jurisdictions, please note that your information is processed according to the standards outlined in this Privacy Policy.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h2 className="font-display font-bold text-base text-white">
            8. Grievance Officer & Contact Information
          </h2>
          <p className="text-xs text-slate-300">
            In accordance with the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023, the details of our designated Grievance Officer are:
          </p>
          <div className="text-xs text-slate-300 space-y-1 pt-1">
            <p><strong>Designation:</strong> Grievance Officer</p>
            <p><strong>Entity:</strong> {LEGAL_NAME}</p>
            <p><strong>Location:</strong> {BUSINESS_LOCATION}</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${GRIEVANCE_EMAIL}`} className="text-indigo-400 hover:text-indigo-300 font-medium underline">
                {GRIEVANCE_EMAIL}
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
        <Link to="/terms" className="hover:text-indigo-400">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/cookies" className="hover:text-indigo-400">Cookie Policy</Link>
        <span>•</span>
        <Link to="/refund" className="hover:text-indigo-400">Refund Policy</Link>
        <span>•</span>
        <Link to="/faq" className="hover:text-indigo-400">FAQ</Link>
        <span>•</span>
        <Link to="/feedback" className="hover:text-indigo-400">Bug Report & Suggestions</Link>
      </div>
    </div>
  );
};
