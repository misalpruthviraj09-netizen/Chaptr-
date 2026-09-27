import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LibraryPage } from "./pages/LibraryPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { LessonPlayerPage } from "./pages/LessonPlayerPage";
import { ReviewPage } from "./pages/ReviewPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";
import { RefundPolicyPage } from "./pages/RefundPolicyPage";
import { FaqPage } from "./pages/FaqPage";
import { FeedbackReportPage } from "./pages/FeedbackReportPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/refund" element={<RefundPolicyPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/feedback" element={<FeedbackReportPage />} />
            <Route path="/bug-report" element={<FeedbackReportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/books" element={<LibraryPage />} />
            <Route path="/app/books/:slug" element={<BookDetailPage />} />
            <Route path="/app/missions/:id" element={<LessonPlayerPage />} />
            <Route path="/app/review" element={<ReviewPage />} />
            <Route path="/app/leaderboard" element={<LeaderboardPage />} />
            <Route path="/app/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
