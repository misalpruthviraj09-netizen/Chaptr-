import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Pip } from "../components/brand/Pip";
import { APP_NAME } from "../config/brand";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <Pip mood="thinking" size="lg" speechBubble="Lost in the library?" />
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            404 Error
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            This page seems to have wandered off our bookshelves. Let's get you back on your learning path.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/app"
            className="btn-3d w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            to="/"
            className="btn-3d-neutral w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-display font-semibold text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
