import { useState, useCallback, useEffect, useRef } from "react";
import type { PokemonListItem, PokemonType } from "@/data/pokemon";
import {
  type QuizPhase,
  type QuizDifficulty,
  type QuizMode,
  type QuizSession,
  type QuizQuestion,
  DIFFICULTY_CONFIGS,
  generateSession,
} from "@/lib/quiz";

export function useQuiz(allPokemon: PokemonListItem[]) {
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
      setTimeLeft((prev) => (prev === null || prev <= 1 ? 0 : prev - 1));
    }, 1000);
  }, [timeLimitSec]);

  const advanceQuestion = useCallback(() => {
    if (questionIndex + 1 >= totalQuestions) {
      setPhase("finished");
    } else {
      setQuestionIndex((prev) => prev + 1);
      setPhase("playing");
      setSelectedAnswer(null);
    }
  }, [questionIndex, totalQuestions]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "playing") {
      clearTimer();
      setCombo(0);
      setPhase("wrong");
      setTimeout(advanceQuestion, 1200);
    }
  }, [timeLeft, phase, clearTimer, advanceQuestion]);

  useEffect(() => {
    if (phase === "playing" && timeLimitSec) {
      clearTimer();
      startTimer();
    }
    if (phase !== "playing") clearTimer();
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

  function applyAnswer(correct: boolean) {
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
  }

  const handleSilhouetteAnswer = useCallback(
    (pokemon: PokemonListItem) => {
      if (phase !== "playing" || !currentQuestion || currentQuestion.mode !== "silhouette") return;
      setSelectedAnswer(String(pokemon.id));
      applyAnswer(pokemon.id === currentQuestion.pokemon.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, currentQuestion, combo, advanceQuestion],
  );

  const handleTypeAnswer = useCallback(
    (type: PokemonType) => {
      if (phase !== "playing" || !currentQuestion || currentQuestion.mode !== "type") return;
      setSelectedAnswer(type);
      applyAnswer(currentQuestion.answer.includes(type));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, currentQuestion, combo, advanceQuestion],
  );

  const handleGenerationAnswer = useCallback(
    (gen: string) => {
      if (phase !== "playing" || !currentQuestion || currentQuestion.mode !== "generation") return;
      setSelectedAnswer(gen);
      applyAnswer(gen === currentQuestion.answer);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, currentQuestion, combo, advanceQuestion],
  );

  return {
    phase,
    session,
    score,
    combo,
    maxCombo,
    timeLeft,
    timeLimitSec,
    questionIndex,
    totalQuestions,
    currentQuestion,
    selectedAnswer,
    startQuiz,
    resetQuiz: () => setPhase("ready"),
    handleSilhouetteAnswer,
    handleTypeAnswer,
    handleGenerationAnswer,
  } as const;
}
