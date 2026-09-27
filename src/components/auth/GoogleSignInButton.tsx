import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GOOGLE_CLIENT_ID } from "../../config/auth";
import { useAuth } from "../../context/AuthContext";
import { saveCookiePreferences, getStoredCookiePreferences } from "../../services/cookieConsent";
import { ShieldCheck, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  buttonText?: string;
  className?: string;
  isConsentGiven?: boolean;
  onConsentChange?: (agreed: boolean) => void;
  showInlineConsent?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  buttonText = "Continue with Google",
  className = "",
  isConsentGiven,
  onConsentChange,
  showInlineConsent = true,
}) => {
  const { googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [internalConsent, setInternalConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  // Check if consent was already given previously in this browser session
  useEffect(() => {
    const existing = getStoredCookiePreferences();
    if (existing) {
      setInternalConsent(true);
      onConsentChange?.(true);
    }
  }, [onConsentChange]);

  const consentActive = isConsentGiven !== undefined ? isConsentGiven : internalConsent;

  const handleConsentToggle = (checked: boolean) => {
    setInternalConsent(checked);
    setConsentError(null);
    onConsentChange?.(checked);
  };

  const handleGoogleClick = () => {
    // COMPULSORY CHECK: Cookie and Privacy Policy must be accepted
    if (!consentActive) {
      const msg = "Acceptance of the Privacy Policy, Terms & Conditions, and Cookies is compulsory to continue with Google.";
      setConsentError(msg);
      onError?.(msg);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    setConsentError(null);

    try {
      if (!window.google?.accounts?.oauth2) {
        // Fallback: Dynamically ensure script is loaded
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
          initiateOAuthFlow();
        };
        script.onerror = () => {
          setIsLoading(false);
          onError?.("Could not load Google Sign-In SDK. Please check your network connection.");
        };
        document.head.appendChild(script);
      } else {
        initiateOAuthFlow();
      }
    } catch (err: any) {
      setIsLoading(false);
      onError?.(err?.message || "An unexpected error occurred while launching Google Sign-In.");
    }
  };

  const initiateOAuthFlow = () => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            if (tokenResponse.error !== "access_denied") {
              onError?.(`Google Sign-In failed: ${tokenResponse.error_description || tokenResponse.error}`);
            }
            return;
          }

          try {
            const accessToken = tokenResponse.access_token;

            // Fetch userinfo from Google
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!userInfoRes.ok) {
              throw new Error("Unable to retrieve Google profile.");
            }

            const profile = await userInfoRes.json();

            // Explicitly record cookie consent upon successful authentication
            saveCookiePreferences({ functional: true, analytics: false });

            await googleLogin({
              accessToken,
              email: profile.email,
              name: profile.name || profile.email?.split("@")[0] || "Scholar",
              picture: profile.picture,
            });

            setIsLoading(false);
            onSuccess?.();
          } catch (err: any) {
            setIsLoading(false);
            onError?.(err?.message || "Failed to complete authentication with Google.");
          }
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
    } catch (err: any) {
      setIsLoading(false);
      onError?.(err?.message || "Failed to initialize Google Sign-In client.");
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Compulsory Consent Checkbox */}
      {showInlineConsent && (
        <div className={`p-2.5 rounded-xl border transition-colors ${
          consentError
            ? "bg-rose-500/10 border-rose-500/40 text-rose-300"
            : "bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800"
        }`}>
          <div className="flex items-start gap-2.5">
            <input
              id="google-auth-consent"
              type="checkbox"
              required
              checked={consentActive}
              onChange={(e) => handleConsentToggle(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-850 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
            />
            <label
              htmlFor="google-auth-consent"
              className="text-xs text-slate-600 dark:text-slate-300 leading-normal select-none"
            >
              <span className="font-semibold text-slate-800 dark:text-white">Required: </span>
              I agree to the{" "}
              <Link
                to="/terms"
                target="_blank"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Terms & Conditions
              </Link>
              ,{" "}
              <Link
                to="/privacy"
                target="_blank"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Privacy Policy
              </Link>
              , and consent to essential authentication cookies.
            </label>
          </div>

          {consentError && (
            <p className="mt-1.5 text-[11px] text-rose-400 font-medium flex items-center gap-1 pl-6.5">
              <AlertCircle size={13} className="shrink-0" />
              <span>{consentError}</span>
            </p>
          )}
        </div>
      )}

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isLoading}
        className={`w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-3 shadow-xs hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed group ${className} ${
          !consentActive ? "opacity-85 hover:border-indigo-400" : ""
        }`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>{isLoading ? "Connecting to Google..." : buttonText}</span>
      </button>
    </div>
  );
};
