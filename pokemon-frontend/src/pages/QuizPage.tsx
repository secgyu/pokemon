import { useState, useCallback } from "react";
import { Zap } from "lucide-react";
import type { PokemonListItem } from "@/data/pokemon";
import { LoadingScreen } from "@/components/common";
import { PokemonSprite } from "@/components/common";
import { QuizStartScreen } from "@/components/quiz/QuizStartScreen";
import { QuizResultScreen } from "@/components/quiz/QuizResultScreen";
import { usePokemonList } from "@/hooks/usePokemonList";
import { type QuizPhase, type QuizSession, NUM_QUESTIONS, generateSession } from "@/lib/quiz";

export function QuizPage() {
  const { pokemon: allPokemon, loading } = usePokemonList();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>("ready");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);

  const totalQuestions = session ? Math.min(NUM_QUESTIONS, session.questions.length) : 0;
  const currentPokemon = session?.questions[questionIndex] ?? null;
  const choices = session?.choicesPerQuestion[questionIndex] ?? [];

  const startQuiz = useCallback(() => {
    if (allPokemon.length === 0) return;
    setSession(generateSession(allPokemon));
    setQuestionIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPhase("playing");
    setSelectedId(null);
  }, [allPokemon]);

  const handleAnswer = useCallback(
    (pokemon: PokemonListItem) => {
      if (phase !== "playing" || !currentPokemon) return;
      setSelectedId(pokemon.id);

      if (pokemon.id === currentPokemon.id) {
        const newCombo = combo + 1;
        setScore((prev) => prev + 100 * Math.min(newCombo, 5));
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setPhase("correct");
      } else {
        setCombo(0);
        setPhase("wrong");
      }

      setTimeout(() => {
        if (questionIndex + 1 >= totalQuestions) {
          setPhase("finished");
        } else {
          setQuestionIndex((prev) => prev + 1);
          setPhase("playing");
          setSelectedId(null);
        }
      }, 1200);
    },
    [phase, currentPokemon, combo, questionIndex, totalQuestions],
  );

  if (loading) return <LoadingScreen message="퀴즈 준비중..." />;

  if (phase === "ready" || !session || !currentPokemon) {
    return <QuizStartScreen totalPokemon={allPokemon.length} onStart={startQuiz} />;
  }

  if (phase === "finished") {
    const finalScore = score + (selectedId === currentPokemon.id ? 100 * Math.min(combo, 5) : 0);
    return (
      <QuizResultScreen score={finalScore} maxCombo={maxCombo} totalQuestions={totalQuestions} onRestart={startQuiz} />
    );
  }

  const silhouetteFilter =
    phase === "playing"
      ? "brightness(0)"
      : phase === "correct"
        ? "brightness(1) drop-shadow(0 0 12px rgba(122,199,76,0.5))"
        : "brightness(1) drop-shadow(0 0 12px rgba(204,0,0,0.5))";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-lg text-foreground sm:text-xl">Quiz</h1>
          <p className="mt-1 text-sm text-secondary-custom">실루엣을 보고 포켓몬을 맞혀보세요!</p>
        </div>
        <div className="flex items-center gap-4">
          {combo >= 2 && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
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
        <div className="relative">
          <PokemonSprite
            id={currentPokemon.id}
            size="xl"
            className="drop-shadow-lg transition-all duration-300"
            style={{ filter: silhouetteFilter, imageRendering: "pixelated" }}
          />
          {phase === "correct" && (
            <div className="absolute -top-3 -right-3 rounded-full bg-[#7AC74C] px-2 py-0.5 text-[10px] font-bold text-white">
              정답!
            </div>
          )}
          {phase === "wrong" && (
            <div className="absolute -top-3 -right-3 rounded-full bg-[#cc0000] px-2 py-0.5 text-[10px] font-bold text-white">
              오답!
            </div>
          )}
        </div>
      </div>

      <p className="text-center font-pixel text-sm text-foreground">이 포켓몬은 누구일까요?</p>

      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3">
        {choices.map((pokemon) => {
          let borderClass = "border-border hover:border-[#4a4a8a]";
          if (selectedId !== null) {
            if (pokemon.id === currentPokemon.id) {
              borderClass = "border-[#7AC74C] bg-[#7AC74C]/10";
            } else if (pokemon.id === selectedId) {
              borderClass = "border-[#cc0000] bg-[#cc0000]/10 animate-wrong";
            }
          }
          return (
            <button
              key={pokemon.id}
              onClick={() => handleAnswer(pokemon)}
              disabled={phase !== "playing"}
              className={`rounded-xl border ${borderClass} bg-card p-4 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed cursor-pointer ${
                phase === "playing" ? "hover:-translate-y-0.5" : ""
              }`}
            >
              <p className="font-semibold text-foreground">{pokemon.nameKo}</p>
              <p className="text-xs text-muted-foreground">{pokemon.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
