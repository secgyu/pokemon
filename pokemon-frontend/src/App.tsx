import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PokedexPage } from "@/pages/PokedexPage";
import { BattlePage } from "@/pages/BattlePage";
import { QuizPage } from "@/pages/QuizPage";
import { TeamBuilderPage } from "@/pages/TeamBuilderPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PokedexPage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/team" element={<TeamBuilderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
