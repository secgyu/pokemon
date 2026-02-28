import { Zap, Timer } from "lucide-react";
import type { PokemonListItem, PokemonType } from "@/data/pokemon";
import { TYPE_COLORS } from "@/data/pokemon";
import { PokemonSprite } from "@/components/common";
import { type QuizPhase, type QuizQuestion, type QuizSession, MODE_LABELS, TYPE_KO } from "@/lib/quiz";

interface QuizPlayScreenProps {
  session: QuizSession;
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  phase: QuizPhase;
  score: number;
  combo: number;
  timeLeft: number | null;
  timeLimitSec: number | null;
  selectedAnswer: string | null;
  onSilhouetteAnswer: (pokemon: PokemonListItem) => void;
  onTypeAnswer: (type: PokemonType) => void;
  onGenerationAnswer: (gen: string) => void;
}

const CHOICE_BTN =
  "rounded-xl border bg-card p-4 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer";

function choiceClass(selected: string | null, id: string, isCorrect: boolean) {
  if (selected === null) return "border-border hover:border-ring/50";
  if (isCorrect) return "border-[#7AC74C] bg-[#7AC74C]/10";
  if (id === selected) return "border-[#cc0000] bg-[#cc0000]/10 animate-wrong";
  return "border-border";
}

function gridCols(count: number) {
  return count > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
}

const PROMPT: Record<string, string> = {
  silhouette: "이 포켓몬은 누구일까요?",
  type: "이 포켓몬의 타입은?",
  generation: "이 포켓몬은 몇 세대일까요?",
};

export function QuizPlayScreen({
  session,
  question,
  questionIndex,
  totalQuestions,
  phase,
  score,
  combo,
  timeLeft,
  timeLimitSec,
  selectedAnswer,
  onSilhouetteAnswer,
  onTypeAnswer,
  onGenerationAnswer,
}: QuizPlayScreenProps) {
  const isSilhouette = question.mode === "silhouette";
  const showResult = phase === "correct" || phase === "wrong";

  const spriteFilter = isSilhouette
    ? phase === "playing"
      ? "brightness(0)"
      : phase === "correct"
        ? "brightness(1) drop-shadow(0 0 12px rgba(122,199,76,0.5))"
        : "brightness(1) drop-shadow(0 0 12px rgba(204,0,0,0.5))"
    : showResult
      ? phase === "correct"
        ? "drop-shadow(0 0 12px rgba(122,199,76,0.5))"
        : "drop-shadow(0 0 12px rgba(204,0,0,0.5))"
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-lg text-foreground sm:text-xl">Quiz</h1>
          <p className="mt-1 text-sm text-secondary-custom">{MODE_LABELS[session.mode].desc}</p>
        </div>
        <div className="flex items-center gap-4">
          {timeLimitSec !== null && timeLeft !== null && (
            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
                timeLeft <= 3 ? "bg-destructive/10 text-destructive animate-pulse" : "bg-muted text-foreground"
              }`}
            >
              <Timer className="h-3.5 w-3.5" />
              {timeLeft}s
            </div>
          )}
          {combo >= 2 && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary animate-pulse-glow">
              <Zap className="h-3.5 w-3.5" />
              {combo}x COMBO
            </div>
          )}
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums text-foreground">{score}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground tabular-nums">
        {questionIndex + 1} / {totalQuestions}
      </p>

      <div className="flex justify-center py-6">
        <div className={`relative ${phase === "playing" ? "animate-float" : ""}`}>
          {isSilhouette && (
            <div className="absolute inset-0 m-auto h-36 w-36 rounded-full bg-muted/60 blur-2xl sm:h-44 sm:w-44" />
          )}
          <PokemonSprite
            id={question.pokemon.id}
            size="xl"
            className="relative drop-shadow-lg transition-all duration-300"
            style={{ filter: spriteFilter, imageRendering: "pixelated" }}
          />
          {phase === "correct" && (
            <div className="absolute -top-3 -right-3 rounded-full bg-[#7AC74C] px-2 py-0.5 text-[10px] font-bold text-white">
              정답!
            </div>
          )}
          {phase === "wrong" && (
            <div className="absolute -top-3 -right-3 rounded-full bg-[#cc0000] px-2 py-0.5 text-[10px] font-bold text-white">
              {timeLeft === 0 ? "시간초과!" : "오답!"}
            </div>
          )}
        </div>
      </div>

      <p className="text-center font-pixel text-sm text-foreground">{PROMPT[question.mode]}</p>

      <div
        className={`mx-auto grid max-w-2xl gap-3 ${gridCols(
          question.mode === "silhouette" ? question.choices.length : question.choices.length,
        )}`}
      >
        {question.mode === "silhouette" &&
          question.choices.map((p) => (
            <button
              key={p.id}
              onClick={() => onSilhouetteAnswer(p)}
              disabled={phase !== "playing"}
              className={`${CHOICE_BTN} ${choiceClass(selectedAnswer, String(p.id), p.id === question.pokemon.id)} ${phase === "playing" ? "hover:-translate-y-0.5" : ""}`}
            >
              <p className="font-semibold text-foreground">{p.nameKo}</p>
              <p className="text-xs text-muted-foreground">{p.name}</p>
            </button>
          ))}
        {question.mode === "type" &&
          question.choices.map((type) => (
            <button
              key={type}
              onClick={() => onTypeAnswer(type)}
              disabled={phase !== "playing"}
              className={`${CHOICE_BTN} ${choiceClass(selectedAnswer, type, question.answer.includes(type))} ${phase === "playing" ? "hover:-translate-y-0.5" : ""}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
                <p className="font-semibold text-foreground">{TYPE_KO[type]}</p>
              </div>
              <p className="text-xs text-muted-foreground uppercase">{type}</p>
            </button>
          ))}
        {question.mode === "generation" &&
          question.choices.map((gen) => (
            <button
              key={gen}
              onClick={() => onGenerationAnswer(gen)}
              disabled={phase !== "playing"}
              className={`${CHOICE_BTN} ${choiceClass(selectedAnswer, gen, gen === question.answer)} ${phase === "playing" ? "hover:-translate-y-0.5" : ""}`}
            >
              <p className="font-semibold text-foreground">{gen}</p>
            </button>
          ))}
      </div>
    </div>
  );
}
