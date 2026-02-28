import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type QuizDifficulty, type QuizMode, DIFFICULTY_CONFIGS, DIFFICULTY_LABELS, MODE_LABELS } from "@/lib/quiz";

interface QuizStartScreenProps {
  totalPokemon: number;
  onStart: (difficulty: QuizDifficulty, mode: QuizMode) => void;
}

const DIFFICULTIES: QuizDifficulty[] = ["easy", "normal", "hard"];
const MODES: QuizMode[] = ["silhouette", "type", "generation"];

export function QuizStartScreen({ totalPokemon, onStart }: QuizStartScreenProps) {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("normal");
  const [mode, setMode] = useState<QuizMode>("silhouette");

  const config = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <h2 className="text-center font-pixel text-lg text-foreground">Who&apos;s That Pokémon?</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {totalPokemon}마리 중 {config.numQuestions}문제 출제
        </p>

        {/* Difficulty */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">난이도</p>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-lg border px-3 py-2.5 text-center transition-all cursor-pointer ${
                  difficulty === d
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-ring/50 hover:text-foreground"
                }`}
              >
                <p className="text-sm font-semibold">{DIFFICULTY_LABELS[d].label}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-inherit opacity-70">{DIFFICULTY_LABELS[d].desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">문제 유형</p>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg border px-3 py-2.5 text-center transition-all cursor-pointer ${
                  mode === m
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-ring/50 hover:text-foreground"
                }`}
              >
                <p className="text-sm font-semibold">{MODE_LABELS[m].label}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-inherit opacity-70">{MODE_LABELS[m].desc}</p>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onStart(difficulty, mode)}
          className="mt-6 w-full gap-2 bg-primary text-primary-foreground hover:brightness-110 cursor-pointer"
        >
          <Play className="h-4 w-4" />
          퀴즈 시작
        </Button>
      </div>
    </div>
  );
}
