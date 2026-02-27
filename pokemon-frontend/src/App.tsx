import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingScreen } from "@/components/common/LoadingScreen";

const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const PokedexPage = lazy(() => import("@/pages/PokedexPage").then((m) => ({ default: m.PokedexPage })));
const BattlePage = lazy(() => import("@/pages/BattlePage").then((m) => ({ default: m.BattlePage })));
const QuizPage = lazy(() => import("@/pages/QuizPage").then((m) => ({ default: m.QuizPage })));
const TeamBuilderPage = lazy(() => import("@/pages/TeamBuilderPage").then((m) => ({ default: m.TeamBuilderPage })));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen message="페이지 로딩중..." />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<PokedexPage />} />
                    <Route path="/battle" element={<BattlePage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/team" element={<TeamBuilderPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
