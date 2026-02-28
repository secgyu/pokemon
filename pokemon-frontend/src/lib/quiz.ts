import type { PokemonListItem, PokemonType } from "@/data/pokemon";
import { GENERATIONS, ALL_TYPES } from "@/data/pokemon";

export type QuizPhase = "ready" | "playing" | "correct" | "wrong" | "finished";

export type QuizDifficulty = "easy" | "normal" | "hard";

export type QuizMode = "silhouette" | "type" | "generation";

export interface DifficultyConfig {
  numQuestions: number;
  numChoices: number;
  genRange: [number, number];
  timeLimitSec: number | null;
}

export const DIFFICULTY_CONFIGS: Record<QuizDifficulty, DifficultyConfig> = {
  easy: { numQuestions: 10, numChoices: 4, genRange: [1, 251], timeLimitSec: null },
  normal: { numQuestions: 10, numChoices: 4, genRange: [1, 1025], timeLimitSec: null },
  hard: { numQuestions: 15, numChoices: 6, genRange: [1, 1025], timeLimitSec: 10 },
};

export const DIFFICULTY_LABELS: Record<QuizDifficulty, { label: string; desc: string }> = {
  easy: { label: "쉬움", desc: "1~2세대, 4지선다" },
  normal: { label: "보통", desc: "전 세대, 4지선다" },
  hard: { label: "어려움", desc: "전 세대, 6지선다, 10초 제한" },
};

export const MODE_LABELS: Record<QuizMode, { label: string; desc: string }> = {
  silhouette: { label: "실루엣", desc: "그림자를 보고 포켓몬 맞추기" },
  type: { label: "타입", desc: "포켓몬의 타입 맞추기" },
  generation: { label: "세대", desc: "포켓몬의 세대 맞추기" },
};

export const TYPE_KO: Record<PokemonType, string> = {
  normal: "노말", fire: "불꽃", water: "물", electric: "전기",
  grass: "풀", ice: "얼음", fighting: "격투", poison: "독",
  ground: "땅", flying: "비행", psychic: "에스퍼", bug: "벌레",
  rock: "바위", ghost: "고스트", dragon: "드래곤", dark: "악",
  steel: "강철", fairy: "페어리",
};

export interface SilhouetteQuestion {
  mode: "silhouette";
  pokemon: PokemonListItem;
  choices: PokemonListItem[];
}

export interface TypeQuestion {
  mode: "type";
  pokemon: PokemonListItem;
  choices: PokemonType[];
  answer: PokemonType[];
}

export interface GenerationQuestion {
  mode: "generation";
  pokemon: PokemonListItem;
  choices: string[];
  answer: string;
}

export type QuizQuestion = SilhouetteQuestion | TypeQuestion | GenerationQuestion;

export interface QuizSession {
  difficulty: QuizDifficulty;
  mode: QuizMode;
  questions: QuizQuestion[];
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getGenLabel(id: number): string {
  const gen = GENERATIONS.find((g, i) => i > 0 && id >= g.range[0] && id <= g.range[1]);
  return gen?.label ?? "1세대";
}

export function generateSession(
  pool: PokemonListItem[],
  difficulty: QuizDifficulty,
  mode: QuizMode,
): QuizSession {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const filtered = pool.filter((p) => p.id >= config.genRange[0] && p.id <= config.genRange[1]);
  const selected = shuffle(filtered).slice(0, config.numQuestions);

  const questions: QuizQuestion[] = selected.map((pokemon) => {
    switch (mode) {
      case "silhouette": {
        const others = filtered.filter((p) => p.id !== pokemon.id);
        const picked = shuffle(others).slice(0, config.numChoices - 1);
        return {
          mode: "silhouette",
          pokemon,
          choices: shuffle([...picked, pokemon]),
        };
      }
      case "type": {
        const correctTypes = pokemon.types;
        const wrongTypes = shuffle(ALL_TYPES.filter((t) => !correctTypes.includes(t)))
          .slice(0, config.numChoices - correctTypes.length);
        return {
          mode: "type",
          pokemon,
          choices: shuffle([...correctTypes, ...wrongTypes]),
          answer: correctTypes,
        };
      }
      case "generation": {
        const answer = getGenLabel(pokemon.id);
        const genLabels = GENERATIONS.filter((_, i) => i > 0).map((g) => g.label);
        const wrongGens = shuffle(genLabels.filter((g) => g !== answer))
          .slice(0, config.numChoices - 1);
        return {
          mode: "generation",
          pokemon,
          choices: shuffle([...wrongGens, answer]),
          answer,
        };
      }
    }
  });

  return { difficulty, mode, questions };
}
