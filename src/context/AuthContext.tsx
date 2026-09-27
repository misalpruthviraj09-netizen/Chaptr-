import React, { createContext, useContext, useState, useEffect } from "react";
import { api, ApiError } from "../services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (payload: { accessToken?: string; idToken?: string; email?: string; name?: string; picture?: string }) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (name: string, email: string, password: string, timezone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("chaptr_token");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email: email.trim(), password });
    if (res.token) {
      localStorage.setItem("chaptr_token", res.token);
    }
    setUser(res.user);
  };

  const googleLogin = async (payload: {
    accessToken?: string;
    idToken?: string;
    email?: string;
    name?: string;
    picture?: string;
  }) => {
    const res = await api.auth.googleLogin(payload);
    if (res.token) {
      localStorage.setItem("chaptr_token", res.token);
    }
    setUser(res.user);
  };

  const demoLogin = async () => {
    const res = await api.auth.demoLogin();
    if (res.token) {
      localStorage.setItem("chaptr_token", res.token);
    }
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string, timezone?: string) => {
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const res = await api.auth.register({ name: name.trim(), email: email.trim(), password, timezone: tz });
    if (res.token) {
      localStorage.setItem("chaptr_token", res.token);
    }
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem("chaptr_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        demoLogin,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
