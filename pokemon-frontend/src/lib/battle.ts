import type { PokemonDetail, PokemonMove } from "@/data/pokemon";

export interface BattleLog {
  text: string;
  type: "action" | "damage" | "info" | "result";
}

export interface BattlerState {
  pokemon: PokemonDetail;
  currentHp: number;
}

export const DEFAULT_MOVE: PokemonMove = {
  name: "Tackle",
  type: "normal",
  power: 40,
  accuracy: 100,
  category: "physical",
};

export function ensureMoves(pokemon: PokemonDetail): PokemonDetail {
  if (pokemon.moves.length > 0) return pokemon;
  return { ...pokemon, moves: [DEFAULT_MOVE] };
}

export function calculateDamage(
  attacker: PokemonDetail,
  defender: PokemonDetail,
  move: PokemonMove
): number {
  if (move.power === 0) return 0;
  const atkStat = move.category === "special" ? attacker.stats.spAtk : attacker.stats.attack;
  const defStat = move.category === "special" ? defender.stats.spDef : defender.stats.defense;
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  const random = 0.85 + Math.random() * 0.15;
  const base = ((22 * move.power * (atkStat / defStat)) / 50 + 2) * stab * random;
  return Math.max(1, Math.floor(base));
}

export function pickRandomIds(pool: number[], count: number): number[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
