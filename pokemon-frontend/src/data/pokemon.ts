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

export interface Pokemon {
  id: number;
  name: string;
  nameKo: string;
  types: PokemonType[];
  stats: PokemonStats;
  moves: PokemonMove[];
  height: number;
  weight: number;
  description: string;
}

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

export const POKEMON_DATA: Pokemon[] = [
  {
    id: 1, name: "Bulbasaur", nameKo: "이상해씨",
    types: ["grass", "poison"],
    stats: { hp: 45, attack: 49, defense: 49, spAtk: 65, spDef: 65, speed: 45 },
    moves: [
      { name: "Tackle", type: "normal", power: 40, accuracy: 100, category: "physical" },
      { name: "Vine Whip", type: "grass", power: 45, accuracy: 100, category: "physical" },
      { name: "Razor Leaf", type: "grass", power: 55, accuracy: 95, category: "physical" },
      { name: "Solar Beam", type: "grass", power: 120, accuracy: 100, category: "special" },
    ],
    height: 0.7, weight: 6.9,
    description: "태어났을 때부터 등에 이상한 씨앗이 심어져 있으며 몸과 함께 자란다.",
  },
  {
    id: 4, name: "Charmander", nameKo: "파이리",
    types: ["fire"],
    stats: { hp: 39, attack: 52, defense: 43, spAtk: 60, spDef: 50, speed: 65 },
    moves: [
      { name: "Scratch", type: "normal", power: 40, accuracy: 100, category: "physical" },
      { name: "Ember", type: "fire", power: 40, accuracy: 100, category: "special" },
      { name: "Flamethrower", type: "fire", power: 90, accuracy: 100, category: "special" },
      { name: "Fire Blast", type: "fire", power: 110, accuracy: 85, category: "special" },
    ],
    height: 0.6, weight: 8.5,
    description: "꼬리에 타오르는 불꽃은 생명력의 상징이다. 기운이 넘칠 때 밝게 타오른다.",
  },
  {
    id: 7, name: "Squirtle", nameKo: "꼬부기",
    types: ["water"],
    stats: { hp: 44, attack: 48, defense: 65, spAtk: 50, spDef: 64, speed: 43 },
    moves: [
      { name: "Tackle", type: "normal", power: 40, accuracy: 100, category: "physical" },
      { name: "Water Gun", type: "water", power: 40, accuracy: 100, category: "special" },
      { name: "Bubble Beam", type: "water", power: 65, accuracy: 100, category: "special" },
      { name: "Hydro Pump", type: "water", power: 110, accuracy: 80, category: "special" },
    ],
    height: 0.5, weight: 9.0,
    description: "태어난 후에 등의 껍질이 부풀어 단단해진다. 입에서 거품을 내뿜는다.",
  },
  {
    id: 25, name: "Pikachu", nameKo: "피카츄",
    types: ["electric"],
    stats: { hp: 35, attack: 55, defense: 40, spAtk: 50, spDef: 50, speed: 90 },
    moves: [
      { name: "Quick Attack", type: "normal", power: 40, accuracy: 100, category: "physical" },
      { name: "Thunder Shock", type: "electric", power: 40, accuracy: 100, category: "special" },
      { name: "Thunderbolt", type: "electric", power: 90, accuracy: 100, category: "special" },
      { name: "Thunder", type: "electric", power: 110, accuracy: 70, category: "special" },
    ],
    height: 0.4, weight: 6.0,
    description: "볼에 있는 전기 주머니에 전기를 모은다. 숲에 사는 피카츄 무리를 만나면 그곳은 번개가 치니 조심해야 한다.",
  },
  {
    id: 6, name: "Charizard", nameKo: "리자몽",
    types: ["fire", "flying"],
    stats: { hp: 78, attack: 84, defense: 78, spAtk: 109, spDef: 85, speed: 100 },
    moves: [
      { name: "Air Slash", type: "flying", power: 75, accuracy: 95, category: "special" },
      { name: "Flamethrower", type: "fire", power: 90, accuracy: 100, category: "special" },
      { name: "Dragon Claw", type: "dragon", power: 80, accuracy: 100, category: "physical" },
      { name: "Fire Blast", type: "fire", power: 110, accuracy: 85, category: "special" },
    ],
    height: 1.7, weight: 90.5,
    description: "강한 상대를 찾아 하늘을 난다. 무엇이든 녹여버리는 고열의 불꽃을 내뿜는다.",
  },
  {
    id: 9, name: "Blastoise", nameKo: "거북왕",
    types: ["water"],
    stats: { hp: 79, attack: 83, defense: 100, spAtk: 85, spDef: 105, speed: 78 },
    moves: [
      { name: "Bite", type: "dark", power: 60, accuracy: 100, category: "physical" },
      { name: "Water Pulse", type: "water", power: 60, accuracy: 100, category: "special" },
      { name: "Ice Beam", type: "ice", power: 90, accuracy: 100, category: "special" },
      { name: "Hydro Pump", type: "water", power: 110, accuracy: 80, category: "special" },
    ],
    height: 1.6, weight: 85.5,
    description: "등의 대포에서 로켓탄 같은 물줄기를 발사한다. 일부러 무거운 체중으로 상대를 깔아 뭉갠다.",
  },
  {
    id: 3, name: "Venusaur", nameKo: "이상해꽃",
    types: ["grass", "poison"],
    stats: { hp: 80, attack: 82, defense: 83, spAtk: 100, spDef: 100, speed: 80 },
    moves: [
      { name: "Razor Leaf", type: "grass", power: 55, accuracy: 95, category: "physical" },
      { name: "Sludge Bomb", type: "poison", power: 90, accuracy: 100, category: "special" },
      { name: "Solar Beam", type: "grass", power: 120, accuracy: 100, category: "special" },
      { name: "Earthquake", type: "ground", power: 100, accuracy: 100, category: "physical" },
    ],
    height: 2.0, weight: 100.0,
    description: "꽃에서 기분 좋은 향기가 풍긴다. 전투 시에는 꽃잎에서 진정 효과가 있는 꽃가루를 뿜어낸다.",
  },
  {
    id: 150, name: "Mewtwo", nameKo: "뮤츠",
    types: ["psychic"],
    stats: { hp: 106, attack: 110, defense: 90, spAtk: 154, spDef: 90, speed: 130 },
    moves: [
      { name: "Psychic", type: "psychic", power: 90, accuracy: 100, category: "special" },
      { name: "Shadow Ball", type: "ghost", power: 80, accuracy: 100, category: "special" },
      { name: "Ice Beam", type: "ice", power: 90, accuracy: 100, category: "special" },
      { name: "Aura Sphere", type: "fighting", power: 80, accuracy: 100, category: "special" },
    ],
    height: 2.0, weight: 122.0,
    description: "유전자 조작으로 만들어진 포켓몬. 인간의 과학력으로 몸은 만들었지만 온순한 마음을 줄 수는 없었다.",
  },
  {
    id: 94, name: "Gengar", nameKo: "팬텀",
    types: ["ghost", "poison"],
    stats: { hp: 60, attack: 65, defense: 60, spAtk: 130, spDef: 75, speed: 110 },
    moves: [
      { name: "Shadow Ball", type: "ghost", power: 80, accuracy: 100, category: "special" },
      { name: "Sludge Bomb", type: "poison", power: 90, accuracy: 100, category: "special" },
      { name: "Thunderbolt", type: "electric", power: 90, accuracy: 100, category: "special" },
      { name: "Focus Blast", type: "fighting", power: 120, accuracy: 70, category: "special" },
    ],
    height: 1.5, weight: 40.5,
    description: "어둠 속에서 나타나 사람의 그림자에 숨어들어 체온을 빼앗는 무서운 포켓몬.",
  },
  {
    id: 149, name: "Dragonite", nameKo: "망나뇽",
    types: ["dragon", "flying"],
    stats: { hp: 91, attack: 134, defense: 95, spAtk: 100, spDef: 100, speed: 80 },
    moves: [
      { name: "Dragon Claw", type: "dragon", power: 80, accuracy: 100, category: "physical" },
      { name: "Hurricane", type: "flying", power: 110, accuracy: 70, category: "special" },
      { name: "Thunder Punch", type: "electric", power: 75, accuracy: 100, category: "physical" },
      { name: "Earthquake", type: "ground", power: 100, accuracy: 100, category: "physical" },
    ],
    height: 2.2, weight: 210.0,
    description: "바다에서 조난당한 사람을 육지까지 데려다주는 마음씨 착한 포켓몬.",
  },
  {
    id: 130, name: "Gyarados", nameKo: "갸라도스",
    types: ["water", "flying"],
    stats: { hp: 95, attack: 125, defense: 79, spAtk: 60, spDef: 100, speed: 81 },
    moves: [
      { name: "Waterfall", type: "water", power: 80, accuracy: 100, category: "physical" },
      { name: "Crunch", type: "dark", power: 80, accuracy: 100, category: "physical" },
      { name: "Earthquake", type: "ground", power: 100, accuracy: 100, category: "physical" },
      { name: "Ice Fang", type: "ice", power: 65, accuracy: 95, category: "physical" },
    ],
    height: 6.5, weight: 235.0,
    description: "난폭한 성격으로 유명하다. 한 번 날뛰기 시작하면 주변을 모두 불태울 때까지 멈추지 않는다.",
  },
  {
    id: 143, name: "Snorlax", nameKo: "잠만보",
    types: ["normal"],
    stats: { hp: 160, attack: 110, defense: 65, spAtk: 65, spDef: 110, speed: 30 },
    moves: [
      { name: "Body Slam", type: "normal", power: 85, accuracy: 100, category: "physical" },
      { name: "Earthquake", type: "ground", power: 100, accuracy: 100, category: "physical" },
      { name: "Crunch", type: "dark", power: 80, accuracy: 100, category: "physical" },
      { name: "Rest", type: "psychic", power: 0, accuracy: 100, category: "status" },
    ],
    height: 2.1, weight: 460.0,
    description: "하루에 400kg의 음식을 먹지 않으면 만족하지 못한다. 먹고 나면 바로 잠이 든다.",
  },
  {
    id: 131, name: "Lapras", nameKo: "라프라스",
    types: ["water", "ice"],
    stats: { hp: 130, attack: 85, defense: 80, spAtk: 85, spDef: 95, speed: 60 },
    moves: [
      { name: "Ice Beam", type: "ice", power: 90, accuracy: 100, category: "special" },
      { name: "Surf", type: "water", power: 90, accuracy: 100, category: "special" },
      { name: "Thunderbolt", type: "electric", power: 90, accuracy: 100, category: "special" },
      { name: "Psychic", type: "psychic", power: 90, accuracy: 100, category: "special" },
    ],
    height: 2.5, weight: 220.0,
    description: "사람의 말을 이해할 수 있는 높은 지능을 가졌다. 바다를 건너는 사람을 등에 태워준다.",
  },
  {
    id: 248, name: "Tyranitar", nameKo: "마기라스",
    types: ["rock", "dark"],
    stats: { hp: 100, attack: 134, defense: 110, spAtk: 95, spDef: 100, speed: 61 },
    moves: [
      { name: "Stone Edge", type: "rock", power: 100, accuracy: 80, category: "physical" },
      { name: "Crunch", type: "dark", power: 80, accuracy: 100, category: "physical" },
      { name: "Earthquake", type: "ground", power: 100, accuracy: 100, category: "physical" },
      { name: "Fire Punch", type: "fire", power: 75, accuracy: 100, category: "physical" },
    ],
    height: 2.0, weight: 202.0,
    description: "자기 영역을 돌아다니며 싸울 상대를 찾는다. 상대가 되지 않으면 거들떠보지도 않는다.",
  },
  {
    id: 445, name: "Garchomp", nameKo: "한카리아스",
    types: ["dragon", "ground"],
    stats: { hp: 108, attack: 130, defense: 95, spAtk: 80, spDef: 85, speed: 102 },
    moves: [
      { name: "Dragon Claw", type: "dragon", power: 80, accuracy: 100, category: "physical" },
      { name: "Earthquake", type: "ground", power: 100, accuracy: 100, category: "physical" },
      { name: "Stone Edge", type: "rock", power: 100, accuracy: 80, category: "physical" },
      { name: "Fire Fang", type: "fire", power: 65, accuracy: 95, category: "physical" },
    ],
    height: 1.9, weight: 95.0,
    description: "제트기 같은 스피드로 하늘을 날며 먹이를 찾는 사막의 포식자.",
  },
  {
    id: 448, name: "Lucario", nameKo: "루카리오",
    types: ["fighting", "steel"],
    stats: { hp: 70, attack: 110, defense: 70, spAtk: 115, spDef: 70, speed: 90 },
    moves: [
      { name: "Aura Sphere", type: "fighting", power: 80, accuracy: 100, category: "special" },
      { name: "Flash Cannon", type: "steel", power: 80, accuracy: 100, category: "special" },
      { name: "Close Combat", type: "fighting", power: 120, accuracy: 100, category: "physical" },
      { name: "Extreme Speed", type: "normal", power: 80, accuracy: 100, category: "physical" },
    ],
    height: 1.2, weight: 54.0,
    description: "파동의 힘으로 1km 밖에 있는 것도 감지할 수 있다.",
  },
  {
    id: 133, name: "Eevee", nameKo: "이브이",
    types: ["normal"],
    stats: { hp: 55, attack: 55, defense: 50, spAtk: 45, spDef: 65, speed: 55 },
    moves: [
      { name: "Quick Attack", type: "normal", power: 40, accuracy: 100, category: "physical" },
      { name: "Bite", type: "dark", power: 60, accuracy: 100, category: "physical" },
      { name: "Swift", type: "normal", power: 60, accuracy: 100, category: "special" },
      { name: "Last Resort", type: "normal", power: 140, accuracy: 100, category: "physical" },
    ],
    height: 0.3, weight: 6.5,
    description: "불안정한 유전자를 가져 주위 환경에 따라 다양한 모습으로 진화한다.",
  },
  {
    id: 282, name: "Gardevoir", nameKo: "가디안",
    types: ["psychic", "fairy"],
    stats: { hp: 68, attack: 65, defense: 65, spAtk: 125, spDef: 115, speed: 80 },
    moves: [
      { name: "Psychic", type: "psychic", power: 90, accuracy: 100, category: "special" },
      { name: "Moonblast", type: "fairy", power: 95, accuracy: 100, category: "special" },
      { name: "Shadow Ball", type: "ghost", power: 80, accuracy: 100, category: "special" },
      { name: "Thunderbolt", type: "electric", power: 90, accuracy: 100, category: "special" },
    ],
    height: 1.6, weight: 48.4,
    description: "트레이너를 지키기 위해서라면 사이코 파워를 총동원하여 작은 블랙홀까지 만들어낸다.",
  },
];
