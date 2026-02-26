import { useState, useCallback, useMemo } from "react";
import { Trophy, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { POKEMON_DATA, getSpriteUrl, type Pokemon } from "@/data/pokemon";

type QuizState = "playing" | "correct" | "wrong" | "finished";

function getRandomChoices(answer: Pokemon, count = 4): Pokemon[] {
  const others = POKEMON_DATA.filter((p) => p.id !== answer.id);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, count - 1);
  const choices = [...shuffled, answer].sort(() => Math.random() - 0.5);
  return choices;
}

export function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [state, setState] = useState<QuizState>("playing");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const questions = useMemo(() => {
    return [...POKEMON_DATA].sort(() => Math.random() - 0.5);
  }, []);

  const totalQuestions = Math.min(10, questions.length);
  const currentPokemon = questions[questionIndex];

  const choices = useMemo(() => getRandomChoices(currentPokemon), [currentPokemon]);

  const handleAnswer = useCallback(
    (pokemon: Pokemon) => {
      if (state !== "playing") return;
      setSelectedId(pokemon.id);

      if (pokemon.id === currentPokemon.id) {
        const newCombo = combo + 1;
        const comboMultiplier = Math.min(newCombo, 5);
        setScore((prev) => prev + 100 * comboMultiplier);
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setState("correct");
      } else {
        setCombo(0);
        setState("wrong");
      }

      setTimeout(() => {
        if (questionIndex + 1 >= totalQuestions) {
          setState("finished");
        } else {
          setQuestionIndex((prev) => prev + 1);
          setState("playing");
          setSelectedId(null);
        }
      }, 1200);
    },
    [state, currentPokemon, combo, questionIndex, totalQuestions],
  );

  const resetQuiz = () => {
    setQuestionIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setState("playing");
    setSelectedId(null);
  };

  if (state === "finished") {
    const finalScore = score + (selectedId === currentPokemon.id ? 100 * Math.min(combo, 5) : 0);
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="font-pixel text-lg text-foreground">퀴즈 완료!</h2>
          <div className="mt-4 space-y-2">
            <p className="text-3xl font-bold tabular-nums text-primary">{finalScore}</p>
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
            onClick={resetQuiz}
            className="mt-6 gap-2 bg-primary text-primary-foreground hover:brightness-110 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            다시 도전
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="flex justify-center">
        <p className="text-xs text-muted-foreground tabular-nums">
          {questionIndex + 1} / {totalQuestions}
        </p>
      </div>

      {/* Silhouette */}
      <div className="flex justify-center py-6">
        <div className="relative">
          <img
            src={getSpriteUrl(currentPokemon.id)}
            alt="Who's that Pokemon?"
            className="h-40 w-40 sm:h-52 sm:w-52 drop-shadow-lg transition-all duration-300"
            style={{
              filter:
                state === "playing"
                  ? "brightness(0)"
                  : state === "correct"
                    ? "brightness(1) drop-shadow(0 0 12px rgba(122,199,76,0.5))"
                    : "brightness(1) drop-shadow(0 0 12px rgba(204,0,0,0.5))",
              imageRendering: "pixelated",
            }}
          />
          {state === "correct" && (
            <div className="absolute -top-3 -right-3 rounded-full bg-[#7AC74C] px-2 py-0.5 text-[10px] font-bold text-white">
              정답!
            </div>
          )}
          {state === "wrong" && (
            <div className="absolute -top-3 -right-3 rounded-full bg-[#cc0000] px-2 py-0.5 text-[10px] font-bold text-white">
              오답!
            </div>
          )}
        </div>
      </div>

      <p className="text-center font-pixel text-sm text-foreground">이 포켓몬은 누구일까요?</p>

      {/* Answer Choices */}
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
              disabled={state !== "playing"}
              className={`rounded-xl border ${borderClass} bg-card p-4 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed cursor-pointer ${
                state === "playing" ? "hover:-translate-y-0.5" : ""
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
