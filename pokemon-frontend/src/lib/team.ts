import type { PokemonListItem, PokemonDetail, PokemonType } from "@/data/pokemon";
import { TYPE_EFFECTIVENESS, TYPE_WEAKNESS } from "@/constants";

export function getTeamWeaknesses(team: PokemonListItem[]): Map<PokemonType, number> {
  const counts = new Map<PokemonType, number>();
  for (const pokemon of team) {
    const weaknesses = new Set<PokemonType>();
    for (const type of pokemon.types) {
      const ws = TYPE_WEAKNESS[type] || [];
      ws.forEach((w) => weaknesses.add(w));
    }
    weaknesses.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
  }
  return counts;
}

export function getTeamCoverage(
  team: PokemonListItem[],
  details: Map<number, PokemonDetail>
): Set<PokemonType> {
  const covered = new Set<PokemonType>();
  for (const pokemon of team) {
    for (const type of pokemon.types) {
      const eff = TYPE_EFFECTIVENESS[type] || [];
      eff.forEach((e) => covered.add(e));
    }
    const detail = details.get(pokemon.id);
    if (detail) {
      for (const move of detail.moves) {
        const eff = TYPE_EFFECTIVENESS[move.type] || [];
        eff.forEach((e) => covered.add(e));
      }
    }
  }
  return covered;
}
