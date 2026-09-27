// Cookie and Local Storage Consent Management
export interface CookiePreferences {
  necessary: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = "chaptr_cookie_preferences";

export function getStoredCookiePreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      timestamp: parsed.timestamp || new Date().toISOString(),
    };
  } catch (e) {
    return null;
  }
}

export function saveCookiePreferences(prefs: { functional: boolean; analytics: boolean }): CookiePreferences {
  const fullPrefs: CookiePreferences = {
    necessary: true,
    functional: prefs.functional,
    analytics: prefs.analytics,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPrefs));
    window.dispatchEvent(new CustomEvent("chaptr-cookie-preferences-updated", { detail: fullPrefs }));
  } catch (e) {
    // Fail gracefully if storage unavailable
  }

  return fullPrefs;
}

export function openCookiePreferencesModal() {
  window.dispatchEvent(new CustomEvent("chaptr-open-cookie-modal"));
}
