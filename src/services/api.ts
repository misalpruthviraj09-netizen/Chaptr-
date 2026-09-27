// Typed API client for Chaptr backend

const API_BASE = "/api";

export interface ApiErrorPayload {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  code: string;
  fields?: Record<string, string>;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.code = payload.code;
    this.fields = payload.fields;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("chaptr_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // send cookies
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errPayload: ApiErrorPayload = json.error || {
      code: "REQUEST_FAILED",
      message: response.statusText || "Request failed",
    };
    throw new ApiError(errPayload);
  }

  return json.data as T;
}

export const api = {
  auth: {
    register: (payload: { name: string; email: string; password: string; timezone?: string }) =>
      request<{ user: any; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    login: (payload: { email: string; password: string }) =>
      request<{ user: any; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    googleLogin: (payload: {
      accessToken?: string;
      idToken?: string;
      email?: string;
      name?: string;
      picture?: string;
    }) =>
      request<{ user: any; token: string }>("/auth/google", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getConfig: () =>
      request<{ googleClientId: string }>("/auth/config"),

    demoLogin: () =>
      request<{ user: any; token: string }>("/auth/demo-login", {
        method: "POST",
      }),

    logout: () =>
      request<{ success: boolean }>("/auth/logout", {
        method: "POST",
      }),

    getMe: () =>
      request<{ user: any }>("/auth/me"),
  },

  books: {
    getAll: (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category && params.category !== "all") q.append("category", params.category);
      if (params?.search) q.append("search", params.search);
      const qs = q.toString();
      return request<{ books: any[] }>(`/books${qs ? `?${qs}` : ""}`);
    },

    getBySlug: (slug: string) =>
      request<{ book: any }>(`/books/${slug}`),

    start: (slug: string) =>
      request<{ started: boolean; bookSlug: string; firstMissionId: string }>(`/books/${slug}/start`, {
        method: "POST",
      }),
  },

  missions: {
    getById: (id: string) =>
      request<{ mission: any }>(`/missions/${id}`),

    checkQuestion: (
      id: string,
      data: { questionId: string; selectedIndex: number; selectedOptionText?: string }
    ) =>
      request<{
        questionId: string;
        isCorrect: boolean;
        correctIndex: number;
        correctOptionText: string;
        explanation: string;
      }>(`/missions/${id}/check-question`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    submit: (
      id: string,
      answers: Array<{ questionId: string; selectedIndex: number; selectedOptionText?: string }>
    ) =>
      request<{
        score: number;
        totalQuestions: number;
        percentage: number;
        passed: boolean;
        perQuestionResults: any[];
        xpEarned: number;
        totalXp: number;
        level: number;
        previousLevel?: number;
        leveledUp: boolean;
        xpProgress?: {
          currentLevel: number;
          xpInCurrentLevel: number;
          xpForNextLevel: number;
          progressPercent: number;
        };
        currentStreak: number;
        longestStreak: number;
        newBadges: any[];
        nextMissionId: string | null;
      }>(`/missions/${id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      }),
  },

  review: {
    getDue: () =>
      request<{ cards: any[]; totalDueCount: number }>("/review/due"),

    answer: (cardId: string, isCorrect: boolean) =>
      request<{
        success: boolean;
        xpEarned: number;
        totalXp: number;
        level: number;
        leveledUp: boolean;
        nextDueAt: string;
        nextIntervalDays: number;
        currentStreak: number;
        newBadges: any[];
      }>("/review/answer", {
        method: "POST",
        body: JSON.stringify({ cardId, isCorrect }),
      }),
  },

  progress: {
    getDashboard: () =>
      request<{
        user: any;
        progression: any;
        readingMastery?: {
          history: Array<{
            date: string;
            label: string;
            missionsMastered: number;
            cumulativeMissions: number;
            booksCompleted: number;
            cumulativeBooks: number;
          }>;
          summary: {
            totalMissionsMastered30d: number;
            totalBooksCompleted30d: number;
            totalMissionsMasteredAllTime: number;
            totalBooksCompletedAllTime: number;
            activeDaysCount30d: number;
            weeklyVelocityMissions: number;
            completionRatePercent: number;
          };
        };
        streakCalendar: any[];
        dueReviewCount: number;
        booksInProgress: any[];
        allBooksWithMastery: any[];
        recentBadges: any[];
        allBadges: any[];
      }>("/me/dashboard"),
  },

  leaderboard: {
    get: (period: "weekly" | "all" = "weekly") =>
      request<{
        period: string;
        leaderboard: any[];
        currentUserRank: any | null;
      }>(`/leaderboard?period=${period}`),
    reset: () =>
      request<{
        success: boolean;
        message: string;
      }>("/leaderboard/reset", {
        method: "POST",
      }),
  },

  waitlist: {
    join: (payload: { name: string; email: string; role: string }) =>
      request<{
        success: boolean;
        message: string;
        entry: any;
        queuePosition: number;
      }>("/waitlist", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  tutor: {
    getStatus: () =>
      request<{ enabled: boolean; mascot: string; provider: string; model: string }>("/tutor/status"),

    explain: (questionId: string, userSelectedOption?: string) =>
      request<{ questionId: string; explanation: string }>("/tutor/explain", {
        method: "POST",
        body: JSON.stringify({ questionId, userSelectedOption }),
      }),

    ask: (data: {
      message: string;
      bookTitle?: string;
      missionTitle?: string;
      concept?: string;
      history?: { role: string; text: string }[];
    }) =>
      request<{ reply: string }>("/tutor/ask", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
