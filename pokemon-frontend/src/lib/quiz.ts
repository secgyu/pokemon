import type { PokemonListItem } from "@/data/pokemon";

export interface QuizSession {
  questions: PokemonListItem[];
  choicesPerQuestion: PokemonListItem[][];
}

export type QuizPhase = "ready" | "playing" | "correct" | "wrong" | "finished";

export const NUM_QUESTIONS = 10;

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateSession(pool: PokemonListItem[]): QuizSession {
  const questions = shuffle(pool).slice(0, NUM_QUESTIONS);
  const choicesPerQuestion = questions.map((q) => {
    const others = pool.filter((p) => p.id !== q.id);
    const picked = shuffle(others).slice(0, 3);
    return shuffle([...picked, q]);
  });
  return { questions, choicesPerQuestion };
}
