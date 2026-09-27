import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Pip } from "../brand/Pip";
import { PipAssistantModal } from "../brand/PipAssistantModal";
import { CookieConsentBanner } from "../compliance/CookieConsentBanner";
import { Sparkles } from "lucide-react";

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [dueCount, setDueCount] = useState(0);
  const [showPipAssistant, setShowPipAssistant] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api.review
        .getDue()
        .then((res) => {
          setDueCount(res.totalDueCount || 0);
        })
        .catch(() => {
          // ignore
        });
    }
  }, [isAuthenticated, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1020]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // If inside /app and not authenticated, redirect to /login
  if (location.pathname.startsWith("/app") && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAppView = location.pathname.startsWith("/app");
  // Don't show footer on active mission player to minimize distraction
  const isMissionPlayer = location.pathname.includes("/app/missions/");

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1020] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Website Top Header Navigation */}
      {!isMissionPlayer && <Navbar dueReviewsCount={dueCount} />}

      {/* Main Website Content Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Clean Website Footer */}
      {!isMissionPlayer && <Footer />}

      {/* Floating Pip AI Study Companion */}
      {isAppView && !isMissionPlayer && (
        <>
          <button
            type="button"
            onClick={() => setShowPipAssistant(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#131A2E] border border-indigo-500/30 shadow-2xl hover:border-indigo-400 hover:scale-105 active:scale-95 transition-all text-white group cursor-pointer"
            title="Ask Pip AI tutor"
          >
            <Pip mood="happy" size="sm" animate={false} className="shrink-0" />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                <Sparkles size={13} className="text-amber-400 fill-amber-400" />
                <span>Pip AI Tutor</span>
              </div>
              <span className="text-[10px] text-slate-400">Ask a question</span>
            </div>
          </button>
          <PipAssistantModal
            isOpen={showPipAssistant}
            onClose={() => setShowPipAssistant(false)}
          />
        </>
      )}

      {/* Global Privacy & Cookie Gate */}
      <CookieConsentBanner />
    </div>
  );
};
