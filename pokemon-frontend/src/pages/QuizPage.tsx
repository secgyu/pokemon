import { useState, useCallback, useEffect, useRef } from "react";
import { Zap, Timer } from "lucide-react";
import type { PokemonListItem, PokemonType } from "@/data/pokemon";
import { TYPE_COLORS } from "@/data/pokemon";
import { LoadingScreen, PokemonSprite } from "@/components/common";
import { QuizStartScreen } from "@/components/quiz/QuizStartScreen";
import { QuizResultScreen } from "@/components/quiz/QuizResultScreen";
import { usePokemonList } from "@/hooks/usePokemonList";
import {
  type QuizPhase,
  type QuizDifficulty,
  type QuizMode,
  type QuizSession,
  type QuizQuestion,
  DIFFICULTY_CONFIGS,
  MODE_LABELS,
  TYPE_KO,
  generateSession,
} from "@/lib/quiz";

export function QuizPage() {
  const { pokemon: allPokemon, loading } = usePokemonList();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>("ready");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalQuestions = session?.questions.length ?? 0;
  const currentQuestion: QuizQuestion | null = session?.questions[questionIndex] ?? null;
  const timeLimitSec = session ? DIFFICULTY_CONFIGS[session.difficulty].timeLimitSec : null;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (!timeLimitSec) return;
    setTimeLeft(timeLimitSec);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
  }, [timeLimitSec]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "playing") {
      clearTimer();
      setCombo(0);
      setPhase("wrong");
      setTimeout(() => {
        if (questionIndex + 1 >= totalQuestions) {
          setPhase("finished");
        } else {
          setQuestionIndex((prev) => prev + 1);
          setPhase("playing");
          setSelectedAnswer(null);
        }
      }, 1200);
    }
  }, [timeLeft, phase, clearTimer, questionIndex, totalQuestions]);

  useEffect(() => {
    if (phase === "playing" && timeLimitSec) {
      clearTimer();
      startTimer();
    }
    if (phase !== "playing") {
      clearTimer();
    }
    return clearTimer;
  }, [phase, questionIndex, timeLimitSec, clearTimer, startTimer]);

  const startQuiz = useCallback(
    (difficulty: QuizDifficulty, mode: QuizMode) => {
      if (allPokemon.length === 0) return;
      setSession(generateSession(allPokemon, difficulty, mode));
      setQuestionIndex(0);
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setPhase("playing");
      setSelectedAnswer(null);
    },
    [allPokemon],
  );

  const advanceQuestion = useCallback(() => {
    if (questionIndex + 1 >= totalQuestions) {
      setPhase("finished");
    } else {
      setQuestionIndex((prev) => prev + 1);
      setPhase("playing");
      setSelectedAnswer(null);
    }
  }, [questionIndex, totalQuestions]);

  const handleSilhouetteAnswer = useCallback(
    (pokemon: PokemonListItem) => {
      if (phase !== "playing" || !currentQuestion || currentQuestion.mode !== "silhouette") return;
      setSelectedAnswer(String(pokemon.id));
      const correct = pokemon.id === currentQuestion.pokemon.id;
      if (correct) {
        const newCombo = combo + 1;
        setScore((prev) => prev + 100 * Math.min(newCombo, 5));
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setPhase("correct");
      } else {
        setCombo(0);
        setPhase("wrong");
      }
      setTimeout(advanceQuestion, 1200);
    },
    [phase, currentQuestion, combo, advanceQuestion],
  );

  const handleTypeAnswer = useCallback(
    (type: PokemonType) => {
      if (phase !== "playing" || !currentQuestion || currentQuestion.mode !== "type") return;
      setSelectedAnswer(type);
      const correct = currentQuestion.answer.includes(type);
      if (correct) {
        const newCombo = combo + 1;
        setScore((prev) => prev + 100 * Math.min(newCombo, 5));
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setPhase("correct");
      } else {
        setCombo(0);
        setPhase("wrong");
      }
      setTimeout(advanceQuestion, 1200);
    },
    [phase, currentQuestion, combo, advanceQuestion],
  );

  const handleGenerationAnswer = useCallback(
    (gen: string) => {
      if (phase !== "playing" || !currentQuestion || currentQuestion.mode !== "generation") return;
      setSelectedAnswer(gen);
      const correct = gen === currentQuestion.answer;
      if (correct) {
        const newCombo = combo + 1;
        setScore((prev) => prev + 100 * Math.min(newCombo, 5));
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setPhase("correct");
      } else {
        setCombo(0);
        setPhase("wrong");
      }
      setTimeout(advanceQuestion, 1200);
    },
    [phase, currentQuestion, combo, advanceQuestion],
  );

  if (loading) return <LoadingScreen message="퀴즈 준비중..." />;

  if (phase === "ready" || !session || !currentQuestion) {
    return <QuizStartScreen totalPokemon={allPokemon.length} onStart={startQuiz} />;
  }

  if (phase === "finished") {
    return (
      <QuizResultScreen
        score={score}
        maxCombo={maxCombo}
        totalQuestions={totalQuestions}
        onRestart={() => setPhase("ready")}
      />
    );
  }

  const isSilhouetteMode = currentQuestion.mode === "silhouette";
  const showPokemon = phase === "correct" || phase === "wrong";

  const silhouetteFilter =
    phase === "playing"
      ? "brightness(0)"
      : phase === "correct"
        ? "brightness(1) drop-shadow(0 0 12px rgba(122,199,76,0.5))"
        : "brightness(1) drop-shadow(0 0 12px rgba(204,0,0,0.5))";

  const spriteFilter = isSilhouetteMode
    ? silhouetteFilter
    : showPokemon
      ? phase === "correct"
        ? "drop-shadow(0 0 12px rgba(122,199,76,0.5))"
        : "drop-shadow(0 0 12px rgba(204,0,0,0.5))"
      : undefined;

  const promptText =
    currentQuestion.mode === "silhouette"
      ? "이 포켓몬은 누구일까요?"
      : currentQuestion.mode === "type"
        ? "이 포켓몬의 타입은?"
        : "이 포켓몬은 몇 세대일까요?";

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Progress */}
      <p className="text-center text-xs text-muted-foreground tabular-nums">
        {questionIndex + 1} / {totalQuestions}
      </p>

      {/* Pokemon Display */}
      <div className="flex justify-center py-6">
        <div className={`relative ${phase === "playing" ? "animate-float" : ""}`}>
          {isSilhouetteMode && (
            <div className="absolute inset-0 m-auto h-36 w-36 rounded-full bg-muted/60 blur-2xl sm:h-44 sm:w-44" />
          )}
          <PokemonSprite
            id={currentQuestion.pokemon.id}
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

      <p className="text-center font-pixel text-sm text-foreground">{promptText}</p>

      {/* Choices */}
      {currentQuestion.mode === "silhouette" && (
        <div
          className={`mx-auto grid max-w-2xl gap-3 ${
            currentQuestion.choices.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
          }`}
        >
          {currentQuestion.choices.map((pokemon) => {
            let borderClass = "border-border hover:border-ring/50";
            if (selectedAnswer !== null) {
              if (pokemon.id === currentQuestion.pokemon.id) {
                borderClass = "border-[#7AC74C] bg-[#7AC74C]/10";
              } else if (String(pokemon.id) === selectedAnswer) {
                borderClass = "border-[#cc0000] bg-[#cc0000]/10 animate-wrong";
              }
            }
            return (
              <button
                key={pokemon.id}
                onClick={() => handleSilhouetteAnswer(pokemon)}
                disabled={phase !== "playing"}
                className={`rounded-xl border ${borderClass} bg-card p-4 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                  phase === "playing" ? "hover:-translate-y-0.5" : ""
                }`}
              >
                <p className="font-semibold text-foreground">{pokemon.nameKo}</p>
                <p className="text-xs text-muted-foreground">{pokemon.name}</p>
              </button>
            );
          })}
        </div>
      )}

      {currentQuestion.mode === "type" && (
        <div
          className={`mx-auto grid max-w-2xl gap-3 ${
            currentQuestion.choices.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
          }`}
        >
          {currentQuestion.choices.map((type) => {
            const isAnswer = currentQuestion.answer.includes(type);
            let borderClass = "border-border hover:border-ring/50";
            if (selectedAnswer !== null) {
              if (isAnswer) {
                borderClass = "border-[#7AC74C] bg-[#7AC74C]/10";
              } else if (type === selectedAnswer) {
                borderClass = "border-[#cc0000] bg-[#cc0000]/10 animate-wrong";
              }
            }
            return (
              <button
                key={type}
                onClick={() => handleTypeAnswer(type)}
                disabled={phase !== "playing"}
                className={`rounded-xl border ${borderClass} bg-card p-4 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                  phase === "playing" ? "hover:-translate-y-0.5" : ""
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
                  <p className="font-semibold text-foreground">{TYPE_KO[type]}</p>
                </div>
                <p className="text-xs text-muted-foreground uppercase">{type}</p>
              </button>
            );
          })}
        </div>
      )}

      {currentQuestion.mode === "generation" && (
        <div
          className={`mx-auto grid max-w-2xl gap-3 ${
            currentQuestion.choices.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
          }`}
        >
          {currentQuestion.choices.map((gen) => {
            let borderClass = "border-border hover:border-ring/50";
            if (selectedAnswer !== null) {
              if (gen === currentQuestion.answer) {
                borderClass = "border-[#7AC74C] bg-[#7AC74C]/10";
              } else if (gen === selectedAnswer) {
                borderClass = "border-[#cc0000] bg-[#cc0000]/10 animate-wrong";
              }
            }
            return (
              <button
                key={gen}
                onClick={() => handleGenerationAnswer(gen)}
                disabled={phase !== "playing"}
                className={`rounded-xl border ${borderClass} bg-card p-4 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                  phase === "playing" ? "hover:-translate-y-0.5" : ""
                }`}
              >
                <p className="font-semibold text-foreground">{gen}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
