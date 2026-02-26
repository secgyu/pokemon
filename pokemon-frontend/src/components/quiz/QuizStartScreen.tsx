import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NUM_QUESTIONS } from "@/lib/quiz";

interface QuizStartScreenProps {
  totalPokemon: number;
  onStart: () => void;
}

export function QuizStartScreen({ totalPokemon, onStart }: QuizStartScreenProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="font-pixel text-lg text-foreground">Who&apos;s That Pokemon?</h2>
        <p className="mt-3 text-sm text-muted-foreground">실루엣을 보고 포켓몬을 맞혀보세요!</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {totalPokemon}마리 중 {NUM_QUESTIONS}문제 출제
        </p>
        <Button
          onClick={onStart}
          className="mt-6 gap-2 bg-primary text-primary-foreground hover:brightness-110 cursor-pointer"
        >
          <Play className="h-4 w-4" />
          퀴즈 시작
        </Button>
      </div>
    </div>
  );
}
