import type { PokemonListItem, PokemonDetail, PokemonMove } from "@/data/pokemon";

export const MOVE_THUNDERBOLT: PokemonMove = {
  name: "Thunderbolt",
  type: "electric",
  power: 90,
  accuracy: 100,
  category: "special",
};

export const MOVE_FLAMETHROWER: PokemonMove = {
  name: "Flamethrower",
  type: "fire",
  power: 90,
  accuracy: 100,
  category: "special",
};

export const MOVE_TACKLE: PokemonMove = {
  name: "Tackle",
  type: "normal",
  power: 40,
  accuracy: 100,
  category: "physical",
};

export const MOVE_STATUS: PokemonMove = {
  name: "Growl",
  type: "normal",
  power: 0,
  accuracy: 100,
  category: "status",
};

export const PIKACHU_LIST: PokemonListItem = {
  id: 25,
  name: "Pikachu",
  nameKo: "피카츄",
  types: ["electric"],
};

export const CHARIZARD_LIST: PokemonListItem = {
  id: 6,
  name: "Charizard",
  nameKo: "리자몽",
  types: ["fire", "flying"],
};

export const BULBASAUR_LIST: PokemonListItem = {
  id: 1,
  name: "Bulbasaur",
  nameKo: "이상해씨",
  types: ["grass", "poison"],
};

export const PIKACHU_DETAIL: PokemonDetail = {
  ...PIKACHU_LIST,
  stats: { hp: 35, attack: 55, defense: 40, spAtk: 50, spDef: 50, speed: 90 },
  moves: [MOVE_THUNDERBOLT, MOVE_TACKLE],
  height: 0.4,
  weight: 6.0,
  description: "볼에 있는 전기 주머니에 전기를 모은다.",
};

export const CHARIZARD_DETAIL: PokemonDetail = {
  ...CHARIZARD_LIST,
  stats: { hp: 78, attack: 84, defense: 78, spAtk: 109, spDef: 85, speed: 100 },
  moves: [MOVE_FLAMETHROWER],
  height: 1.7,
  weight: 90.5,
  description: "강한 상대를 찾아 하늘을 난다.",
};

export const NO_MOVES_POKEMON: PokemonDetail = {
  id: 999,
  name: "NoMoves",
  nameKo: "기술없음",
  types: ["normal"],
  stats: { hp: 50, attack: 50, defense: 50, spAtk: 50, spDef: 50, speed: 50 },
  moves: [],
  height: 1.0,
  weight: 10.0,
  description: "",
};

export function makePokemonList(count: number): PokemonListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Pokemon${i + 1}`,
    nameKo: `포켓몬${i + 1}`,
    types: ["normal"] as PokemonListItem["types"],
  }));
}
