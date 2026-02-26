export type PokemonType =
  | "normal" | "fire" | "water" | "electric" | "grass" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug"
  | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy";

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const ALL_TYPES: PokemonType[] = Object.keys(TYPE_COLORS) as PokemonType[];

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface PokemonMove {
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  category: "physical" | "special" | "status";
}

export interface PokemonListItem {
  id: number;
  name: string;
  nameKo: string;
  types: PokemonType[];
}

export interface PokemonDetail extends PokemonListItem {
  stats: PokemonStats;
  moves: PokemonMove[];
  height: number;
  weight: number;
  description: string;
}

export type Pokemon = PokemonDetail;

export const GENERATIONS = [
  { label: "전체", range: [1, 1025] as const },
  { label: "1세대", range: [1, 151] as const },
  { label: "2세대", range: [152, 251] as const },
  { label: "3세대", range: [252, 386] as const },
  { label: "4세대", range: [387, 493] as const },
  { label: "5세대", range: [494, 649] as const },
  { label: "6세대", range: [650, 721] as const },
  { label: "7세대", range: [722, 809] as const },
  { label: "8세대", range: [810, 905] as const },
  { label: "9세대", range: [906, 1025] as const },
];

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}
