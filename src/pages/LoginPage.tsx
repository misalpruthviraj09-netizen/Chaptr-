import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { APP_NAME } from "../config/brand";
import { Pip } from "../components/brand/Pip";
import { useAuth } from "../context/AuthContext";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { saveCookiePreferences } from "../services/cookieConsent";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/app";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address with '@'.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!agreedToTerms) {
      setError("Acceptance of the Privacy Policy, Terms & Conditions, and Cookies is compulsory to sign in.");
      return;
    }

    setIsLoading(true);

    try {
      await login(cleanEmail, password);
      saveCookiePreferences({ functional: true, analytics: false });
      const from = (location.state as any)?.from?.pathname || "/app";
      navigate(from, { replace: true });
    } catch (err: any) {
      const message = err.message || "Invalid email or password.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isUserNotFound = error && error.toLowerCase().includes("no account found");

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Pip mood="happy" size="sm" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Welcome back to {APP_NAME}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your reading streaks and book missions.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {isUserNotFound && (
              <div className="pt-1 border-t border-rose-200 dark:border-rose-800/60 flex items-center justify-between">
                <span>Need to create this account?</span>
                <Link
                  to="/register"
                  className="font-bold underline hover:text-rose-900 dark:hover:text-rose-100"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <GoogleSignInButton
            isConsentGiven={agreedToTerms}
            onConsentChange={setAgreedToTerms}
            showInlineConsent={true}
            onSuccess={() => {
              const from = (location.state as any)?.from?.pathname || "/app";
              navigate(from, { replace: true });
            }}
            onError={(msg) => setError(msg)}
            buttonText="Sign in with Google"
          />

          <div className="relative flex items-center justify-center my-1">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-3d w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register Free
          </Link>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          <Link to="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
};


