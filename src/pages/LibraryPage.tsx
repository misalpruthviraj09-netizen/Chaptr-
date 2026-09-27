import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, BookOpen, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { api } from "../services/api";
import { BookCover } from "../components/brand/BookCover";
import { Pip } from "../components/brand/Pip";

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const categories = [
    { id: "all", label: "All Books" },
    { id: "Self-improvement", label: "Self-improvement" },
    { id: "Finance", label: "Finance & Wealth" },
    { id: "Psychology", label: "Psychology" },
    { id: "Business", label: "Business & Strategy" },
    { id: "Productivity", label: "Productivity & Focus" },
  ];

  const fetchBooks = () => {
    setLoading(true);
    api.books
      .getAll({ category: category !== "all" ? category : undefined, search: search.trim() || undefined })
      .then((res) => {
        setBooks(res.books);
      })
      .catch((err) => {
        console.error("Failed to load books:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBooks();
    }, 200);
    return () => clearTimeout(handler);
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
            Curated Book Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick a classic or foundational guide to start your interactive learning path.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#131A2E] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat.id
                ? "bg-[#3730A3] text-white shadow-xs"
                : "bg-white dark:bg-[#131A2E] text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-white/10 hover:border-indigo-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-[#131A2E] rounded-3xl" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 space-y-4 max-w-md mx-auto">
          <Pip mood="thinking" size="md" />
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            No books found matching your criteria
          </h3>
          <p className="text-xs text-slate-500">
            Try resetting your search or choosing a different category chip.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="btn-3d px-5 py-2.5 rounded-xl font-display text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/app/books/${book.slug}`}
              className="group bg-white dark:bg-[#131A2E] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(11,16,32,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-5">
                <div className="shrink-0">
                  <BookCover book={book} size="md" />
                </div>
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2DD4BF]">
                        {book.category}
                      </span>
                      {book.isPublicDomain && (
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#18223C] text-slate-500 font-medium">
                          Classic
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{book.author}</p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen size={14} className="text-indigo-500" />
                      {book.totalMissions} Missions
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={14} className="text-slate-400" />
                      {book.totalMinutes} min total
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Footer */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                {book.isStarted ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>{book.completedMissions} of {book.totalMissions} completed</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{book.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${book.progressPercent}%`,
                          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Start Learning Path &rarr;
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
