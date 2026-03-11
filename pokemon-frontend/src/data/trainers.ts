import type { PokemonType } from "./pokemon";

export type TrainerRank = "gym" | "elite4" | "champion";

export interface TrainerData {
  id: string;
  name: string;
  nameKo: string;
  title: string;
  rank: TrainerRank;
  specialty: PokemonType;
  pokemonIds: number[];
  quote: string;
  badgeName?: string;
  order: number;
}

export const RANK_LABELS: Record<TrainerRank, string> = {
  gym: "체육관 관장",
  elite4: "사천왕",
  champion: "챔피언",
};

export const RANK_COLORS: Record<TrainerRank, string> = {
  gym: "#7AC74C",
  elite4: "#6F35FC",
  champion: "#F7D02C",
};

export const GYM_LEADERS: TrainerData[] = [
  {
    id: "brock",
    name: "Brock",
    nameKo: "웅",
    title: "회색시티 체육관 관장",
    rank: "gym",
    specialty: "rock",
    pokemonIds: [74, 95],
    quote: "바위처럼 단단한 나의 포켓몬을 이겨보겠다는 거냐!",
    badgeName: "회색배지",
    order: 1,
  },
  {
    id: "misty",
    name: "Misty",
    nameKo: "이슬",
    title: "블루시티 체육관 관장",
    rank: "gym",
    specialty: "water",
    pokemonIds: [120, 121],
    quote: "나의 물 포켓몬 정책! 보여줄게!",
    badgeName: "블루배지",
    order: 2,
  },
  {
    id: "lt-surge",
    name: "Lt. Surge",
    nameKo: "마티스",
    title: "갈색시티 체육관 관장",
    rank: "gym",
    specialty: "electric",
    pokemonIds: [100, 25, 26],
    quote: "전기 포켓몬은 최강이지! 느껴봐!",
    badgeName: "주황배지",
    order: 3,
  },
  {
    id: "erika",
    name: "Erika",
    nameKo: "민화",
    title: "무지개시티 체육관 관장",
    rank: "gym",
    specialty: "grass",
    pokemonIds: [71, 114, 45],
    quote: "풀 포켓몬의 아름다움을 보여줄게요.",
    badgeName: "무지개배지",
    order: 4,
  },
  {
    id: "koga",
    name: "Koga",
    nameKo: "독수",
    title: "연분홍시티 체육관 관장",
    rank: "gym",
    specialty: "poison",
    pokemonIds: [109, 89, 110],
    quote: "독의 공포를 알게 해주마!",
    badgeName: "핑크배지",
    order: 5,
  },
  {
    id: "sabrina",
    name: "Sabrina",
    nameKo: "초련",
    title: "노랑시티 체육관 관장",
    rank: "gym",
    specialty: "psychic",
    pokemonIds: [64, 122, 65],
    quote: "에스퍼 타입의 힘... 네가 감당할 수 있을까?",
    badgeName: "골드배지",
    order: 6,
  },
  {
    id: "blaine",
    name: "Blaine",
    nameKo: "강연",
    title: "홍련시티 체육관 관장",
    rank: "gym",
    specialty: "fire",
    pokemonIds: [58, 77, 59],
    quote: "뜨거운 승부를 보여줄게! 불꽃 배틀이다!",
    badgeName: "진홍배지",
    order: 7,
  },
  {
    id: "giovanni",
    name: "Giovanni",
    nameKo: "비주기",
    title: "상록시티 체육관 관장",
    rank: "gym",
    specialty: "ground",
    pokemonIds: [111, 51, 31],
    quote: "나는 로켓단 보스이자 체육관 관장! 덤벼라!",
    badgeName: "초록배지",
    order: 8,
  },
];

export const ELITE_FOUR: TrainerData[] = [
  {
    id: "lorelei",
    name: "Lorelei",
    nameKo: "칸나",
    title: "사천왕 첫 번째",
    rank: "elite4",
    specialty: "ice",
    pokemonIds: [87, 91, 80, 124],
    quote: "얼음의 세계에 온 걸 환영해.",
    order: 1,
  },
  {
    id: "bruno",
    name: "Bruno",
    nameKo: "시바",
    title: "사천왕 두 번째",
    rank: "elite4",
    specialty: "fighting",
    pokemonIds: [95, 107, 106, 68],
    quote: "격투 포켓몬의 진정한 힘을 보여주겠다!",
    order: 2,
  },
  {
    id: "agatha",
    name: "Agatha",
    nameKo: "국화",
    title: "사천왕 세 번째",
    rank: "elite4",
    specialty: "ghost",
    pokemonIds: [94, 93, 42, 94],
    quote: "고스트 타입의 저주가 너를 기다리고 있단다.",
    order: 3,
  },
  {
    id: "lance",
    name: "Lance",
    nameKo: "목호",
    title: "사천왕 네 번째",
    rank: "elite4",
    specialty: "dragon",
    pokemonIds: [130, 148, 149, 142],
    quote: "드래곤 마스터로서 너를 상대하겠다!",
    order: 4,
  },
];

export const CHAMPION: TrainerData = {
  id: "blue",
  name: "Blue",
  nameKo: "그린",
  title: "포켓몬 리그 챔피언",
  rank: "champion",
  specialty: "normal",
  pokemonIds: [18, 65, 112, 59, 103, 130],
  quote: "나는 챔피언이다! 세상에서 가장 강한 트레이너!",
  order: 1,
};

export const ALL_TRAINERS: TrainerData[] = [...GYM_LEADERS, ...ELITE_FOUR, CHAMPION];

export function getTrainerById(id: string): TrainerData | undefined {
  return ALL_TRAINERS.find((t) => t.id === id);
}
