import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Lock, Mail, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { APP_NAME } from "../config/brand";
import { Logo } from "../components/brand/Logo";
import { Pip } from "../components/brand/Pip";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { saveCookiePreferences } from "../services/cookieConsent";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/app";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side quick validation
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!email.includes("@")) errs.email = "Please enter a valid email address.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions and Privacy Policy to create an account.");
      return;
    }

    setIsLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      saveCookiePreferences({ functional: true, analytics: false });
      const from = (location.state as any)?.from?.pathname || "/app";
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err instanceof ApiError && err.fields) {
        setFieldErrors(err.fields);
      }
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Pip mood="cheering" size="sm" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Create your {APP_NAME} account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Start turning great books into lasting knowledge today.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {error}
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
            buttonText="Sign up with Google"
          />

          <div className="relative flex items-center justify-center my-1">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium">
              or sign up with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Aurelius"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            {fieldErrors.name && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@philosophy.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password (min 8 characters)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="reg-consent"
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="reg-consent" className="text-xs text-slate-300 leading-normal select-none">
              I agree to the{" "}
              <Link to="/terms" target="_blank" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" target="_blank" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            className="btn-3d w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
          >
            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
