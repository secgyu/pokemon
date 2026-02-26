import { Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizResultScreenProps {
  score: number;
  maxCombo: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizResultScreen({ score, maxCombo, totalQuestions, onRestart }: QuizResultScreenProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
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
        <Button
          onClick={onRestart}
          className="mt-6 gap-2 bg-primary text-primary-foreground hover:brightness-110 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          다시 도전
        </Button>
      </div>
    </div>
  );
}
