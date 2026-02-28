import { useState, useEffect, useRef } from "react";
import { Trophy, RotateCcw, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import { apiSaveQuizScore } from "@/lib/api";
import { QuizRankings } from "./QuizRankings";

interface QuizResultScreenProps {
  score: number;
  maxCombo: number;
  totalQuestions: number;
  onRestart: () => void;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function QuizResultScreen({ score, maxCombo, totalQuestions, onRestart }: QuizResultScreenProps) {
  const { token } = useAuthContext();
  const [saveState, setSaveState] = useState<SaveState>(token ? "saving" : "idle");
  const savedRef = useRef(false);

  useEffect(() => {
    if (!token || savedRef.current) return;
    savedRef.current = true;
    apiSaveQuizScore(token, score, totalQuestions)
      .then(() => setSaveState("saved"))
      .catch(() => setSaveState("error"));
  }, [token, score, totalQuestions]);

  function retrySave() {
    if (!token) return;
    setSaveState("saving");
    apiSaveQuizScore(token, score, totalQuestions)
      .then(() => setSaveState("saved"))
      .catch(() => setSaveState("error"));
  }

  return (
    <div className="space-y-6 py-8">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h2 className="font-pixel text-lg text-foreground">퀴즈 완료!</h2>
        <div className="mt-4 space-y-2">
          <p className="text-3xl font-bold tabular-nums text-primary">{score}</p>
          <p className="text-sm text-muted-foreground">점수</p>
        </div>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div>
            <p className="font-semibold text-foreground">{maxCombo}x</p>
            <p className="text-xs text-muted-foreground">최대 콤보</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{totalQuestions}문제</p>
            <p className="text-xs text-muted-foreground">총 문제</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          {saveState === "saving" && "점수 저장중..."}
          {saveState === "saved" && (
            <span className="flex items-center justify-center gap-1 text-[#7AC74C]">
              <Check className="h-3 w-3" /> 점수 저장 완료
            </span>
          )}
          {saveState === "error" && (
            <button
              onClick={retrySave}
              className="flex items-center justify-center gap-1 text-destructive hover:underline cursor-pointer"
            >
              <Save className="h-3 w-3" /> 저장 실패 - 다시 시도
            </button>
          )}
        </div>

        <Button
          onClick={onRestart}
          className="mt-6 gap-2 bg-primary text-primary-foreground hover:brightness-110 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          다시 도전
        </Button>
      </div>

      <div className="mx-auto max-w-md">
        <QuizRankings />
      </div>
    </div>
  );
}
