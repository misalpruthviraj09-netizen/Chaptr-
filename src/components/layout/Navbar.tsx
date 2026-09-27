import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Flame, Sparkles, BookOpen, Layers, Trophy, User as UserIcon, Menu, X, BrainCircuit, HelpCircle, LogOut } from "lucide-react";
import { Logo } from "../brand/Logo";
import { useAuth } from "../../context/AuthContext";

export interface NavbarProps {
  dueReviewsCount?: number;
}

interface NavLinkItem {
  name: string;
  href: string;
  icon?: any;
  badge?: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({ dueReviewsCount = 0 }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: NavLinkItem[] = isAuthenticated
    ? [
        { name: "Dashboard", href: "/app", icon: Layers },
        { name: "Library", href: "/app/books", icon: BookOpen },
        {
          name: "Review Deck",
          href: "/app/review",
          icon: BrainCircuit,
          badge: dueReviewsCount > 0 ? dueReviewsCount : null,
        },
        { name: "Leaderboard", href: "/app/leaderboard", icon: Trophy },
        { name: "My Profile", href: "/app/profile", icon: UserIcon },
      ]
    : [
        { name: "Curriculum", href: "/#sample-path" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Why Chaptr", href: "/#why-different" },
        { name: "FAQ", href: "/faq", icon: HelpCircle },
        { name: "Join Waitlist", href: "/#waitlist" },
      ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B1020]/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? "/app" : "/"} className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/app"
                ? location.pathname === "/app"
                : link.href.startsWith("/#")
                ? false
                : location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? "text-indigo-400 bg-indigo-500/10 font-semibold border border-indigo-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {Icon && <Icon size={16} className="shrink-0" />}
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-indigo-600 text-white animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: User Status & Auth Buttons */}
        <div className="flex items-center gap-3">
          {/* Streak badge (when authenticated) */}
          {isAuthenticated && user && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-bold shadow-xs select-none"
              title={`${user.currentStreak} day learning streak!`}
            >
              <Flame
                size={16}
                className="fill-current text-[#F97316] animate-flame-pulse"
                style={{
                  filter: `drop-shadow(0 0 ${Math.min(12, 3 + (user.currentStreak || 1))}px rgba(249, 115, 22, 0.7))`,
                }}
              />
              <span className="font-display">{user.currentStreak}d Streak</span>
            </div>
          )}

          {/* Auth CTA or User Menu */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/app/profile"
                className="hidden sm:flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-colors bg-slate-900/60"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-display font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-bold">
                    Lvl {user.level} • {user.xp} XP
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="hidden md:flex p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-3d px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl md:hidden text-slate-300 hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Website Mobile Dropdown Menu (Standard Website Header) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0E1528] px-4 py-4 space-y-2 shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon size={18} className="text-indigo-400" />}
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-600 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                <span>Log Out of Chaptr</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2 border-t border-slate-800">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-bold text-white bg-indigo-600 shadow-md text-sm"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
