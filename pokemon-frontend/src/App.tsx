import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingScreen } from "@/components/common/LoadingScreen";

const PokedexPage = lazy(() => import("@/pages/PokedexPage").then((m) => ({ default: m.PokedexPage })));
const BattlePage = lazy(() => import("@/pages/BattlePage").then((m) => ({ default: m.BattlePage })));
const QuizPage = lazy(() => import("@/pages/QuizPage").then((m) => ({ default: m.QuizPage })));
const TeamBuilderPage = lazy(() => import("@/pages/TeamBuilderPage").then((m) => ({ default: m.TeamBuilderPage })));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen message="페이지 로딩중..." />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<PokedexPage />} />
                <Route path="/battle" element={<BattlePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/team" element={<TeamBuilderPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
