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
  generation: number;
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

export const GENERATION_LABELS: Record<number, string> = {
  1: "1세대 (관동)",
  2: "2세대 (성도)",
  3: "3세대 (호연)",
  4: "4세대 (신오)",
  5: "5세대 (하나)",
  6: "6세대 (칼로스)",
  7: "7세대 (알로라)",
  8: "8세대 (가라르)",
  9: "9세대 (팔데아)",
};

// ═══════════════════════════════════════════════════════════════════
// 1세대 – 관동 (파이어레드/리프그린)
// ═══════════════════════════════════════════════════════════════════

const GEN1_GYM: TrainerData[] = [
  { id: "brock", name: "Brock", nameKo: "웅", title: "회색시티 체육관 관장", rank: "gym", specialty: "rock", pokemonIds: [74, 95], quote: "바위처럼 단단한 나의 포켓몬을 이겨보겠다는 거냐!", badgeName: "회색배지", generation: 1, order: 1 },
  { id: "misty", name: "Misty", nameKo: "이슬", title: "블루시티 체육관 관장", rank: "gym", specialty: "water", pokemonIds: [120, 121], quote: "나의 물 포켓몬 정책! 보여줄게!", badgeName: "블루배지", generation: 1, order: 2 },
  { id: "lt-surge", name: "Lt. Surge", nameKo: "마티스", title: "갈색시티 체육관 관장", rank: "gym", specialty: "electric", pokemonIds: [100, 25, 26], quote: "전기 포켓몬은 최강이지! 느껴봐!", badgeName: "주황배지", generation: 1, order: 3 },
  { id: "erika", name: "Erika", nameKo: "민화", title: "무지개시티 체육관 관장", rank: "gym", specialty: "grass", pokemonIds: [71, 114, 45], quote: "풀 포켓몬의 아름다움을 보여줄게요.", badgeName: "무지개배지", generation: 1, order: 4 },
  { id: "koga", name: "Koga", nameKo: "독수", title: "연분홍시티 체육관 관장", rank: "gym", specialty: "poison", pokemonIds: [109, 109, 89, 110], quote: "독의 공포를 알게 해주마!", badgeName: "핑크배지", generation: 1, order: 5 },
  { id: "sabrina", name: "Sabrina", nameKo: "초련", title: "노랑시티 체육관 관장", rank: "gym", specialty: "psychic", pokemonIds: [64, 122, 49, 65], quote: "에스퍼 타입의 힘... 네가 감당할 수 있을까?", badgeName: "골드배지", generation: 1, order: 6 },
  { id: "blaine", name: "Blaine", nameKo: "강연", title: "홍련시티 체육관 관장", rank: "gym", specialty: "fire", pokemonIds: [58, 77, 78, 59], quote: "뜨거운 승부를 보여줄게! 불꽃 배틀이다!", badgeName: "진홍배지", generation: 1, order: 7 },
  { id: "giovanni", name: "Giovanni", nameKo: "비주기", title: "상록시티 체육관 관장", rank: "gym", specialty: "ground", pokemonIds: [111, 51, 31, 34, 111], quote: "나는 로켓단 보스이자 체육관 관장! 덤벼라!", badgeName: "초록배지", generation: 1, order: 8 },
];

const GEN1_ELITE4: TrainerData[] = [
  { id: "lorelei", name: "Lorelei", nameKo: "칸나", title: "사천왕 첫 번째", rank: "elite4", specialty: "ice", pokemonIds: [87, 91, 80, 124, 131], quote: "얼음의 세계에 온 걸 환영해.", generation: 1, order: 1 },
  { id: "bruno", name: "Bruno", nameKo: "시바", title: "사천왕 두 번째", rank: "elite4", specialty: "fighting", pokemonIds: [95, 107, 106, 95, 68], quote: "격투 포켓몬의 진정한 힘을 보여주겠다!", generation: 1, order: 2 },
  { id: "agatha", name: "Agatha", nameKo: "국화", title: "사천왕 세 번째", rank: "elite4", specialty: "ghost", pokemonIds: [94, 42, 93, 24, 94], quote: "고스트 타입의 저주가 너를 기다리고 있단다.", generation: 1, order: 3 },
  { id: "lance-gen1", name: "Lance", nameKo: "목호", title: "사천왕 네 번째", rank: "elite4", specialty: "dragon", pokemonIds: [130, 148, 148, 142, 149], quote: "드래곤 마스터로서 너를 상대하겠다!", generation: 1, order: 4 },
];

const GEN1_CHAMPION: TrainerData = {
  id: "blue", name: "Blue", nameKo: "그린", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "normal", pokemonIds: [18, 65, 112, 103, 130, 6], quote: "나는 챔피언이다! 세상에서 가장 강한 트레이너!", generation: 1, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 2세대 – 성도 (금/은)
// ═══════════════════════════════════════════════════════════════════

const GEN2_GYM: TrainerData[] = [
  { id: "falkner", name: "Falkner", nameKo: "비상", title: "도라지시티 체육관 관장", rank: "gym", specialty: "flying", pokemonIds: [16, 17], quote: "우아한 새 포켓몬의 힘을 보여주겠어!", badgeName: "제퍼배지", generation: 2, order: 1 },
  { id: "bugsy", name: "Bugsy", nameKo: "호일", title: "잠풀시티 체육관 관장", rank: "gym", specialty: "bug", pokemonIds: [11, 14, 123], quote: "벌레 포켓몬 연구의 성과를 보여줄게!", badgeName: "인섹트배지", generation: 2, order: 2 },
  { id: "whitney", name: "Whitney", nameKo: "꼭두", title: "금빛시티 체육관 관장", rank: "gym", specialty: "normal", pokemonIds: [35, 241], quote: "귀여운 포켓몬이 제일 강한 거 알지?", badgeName: "레귤러배지", generation: 2, order: 3 },
  { id: "morty", name: "Morty", nameKo: "유빈", title: "담청시티 체육관 관장", rank: "gym", specialty: "ghost", pokemonIds: [92, 93, 93, 94], quote: "보이지 않는 것의 힘을 느껴봐.", badgeName: "팬텀배지", generation: 2, order: 4 },
  { id: "chuck", name: "Chuck", nameKo: "사도", title: "연지시티 체육관 관장", rank: "gym", specialty: "fighting", pokemonIds: [57, 62], quote: "파도를 가르는 격투 정신! 받아봐라!", badgeName: "스톰배지", generation: 2, order: 5 },
  { id: "jasmine", name: "Jasmine", nameKo: "규리", title: "아사기시티 체육관 관장", rank: "gym", specialty: "steel", pokemonIds: [81, 81, 208], quote: "강철의 의지를 보여줄게요.", badgeName: "미네랄배지", generation: 2, order: 6 },
  { id: "pryce", name: "Pryce", nameKo: "류옹", title: "엷은숲시티 체육관 관장", rank: "gym", specialty: "ice", pokemonIds: [86, 87, 221], quote: "얼음의 노련함을 보여주마.", badgeName: "글래시어배지", generation: 2, order: 7 },
  { id: "clair", name: "Clair", nameKo: "이향", title: "블랙쏜시티 체육관 관장", rank: "gym", specialty: "dragon", pokemonIds: [148, 148, 148, 230], quote: "용의 여왕에게 도전하겠다고?", badgeName: "라이징배지", generation: 2, order: 8 },
];

const GEN2_ELITE4: TrainerData[] = [
  { id: "will", name: "Will", nameKo: "일목", title: "사천왕 첫 번째", rank: "elite4", specialty: "psychic", pokemonIds: [178, 124, 80, 103, 178], quote: "에스퍼의 예지력으로 네 수를 읽겠어.", generation: 2, order: 1 },
  { id: "koga-elite", name: "Koga", nameKo: "독수", title: "사천왕 두 번째", rank: "elite4", specialty: "poison", pokemonIds: [168, 49, 205, 89, 169], quote: "독의 닌자로서 상대해주마.", generation: 2, order: 2 },
  { id: "bruno-gen2", name: "Bruno", nameKo: "시바", title: "사천왕 세 번째", rank: "elite4", specialty: "fighting", pokemonIds: [237, 106, 107, 95, 68], quote: "격투의 진수를 보여주겠다!", generation: 2, order: 3 },
  { id: "karen", name: "Karen", nameKo: "카렌", title: "사천왕 네 번째", rank: "elite4", specialty: "dark", pokemonIds: [197, 45, 198, 94, 229], quote: "강한 포켓몬, 약한 포켓몬... 그건 사람들의 착각이야.", generation: 2, order: 4 },
];

const GEN2_CHAMPION: TrainerData = {
  id: "lance-champ", name: "Lance", nameKo: "목호", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "dragon", pokemonIds: [130, 149, 6, 142, 149, 149], quote: "드래곤 마스터... 그것이 나의 긍지다!", generation: 2, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 3세대 – 호연 (에메랄드)
// ═══════════════════════════════════════════════════════════════════

const GEN3_GYM: TrainerData[] = [
  { id: "roxanne", name: "Roxanne", nameKo: "원규", title: "금탄시티 체육관 관장", rank: "gym", specialty: "rock", pokemonIds: [74, 74, 299], quote: "바위 포켓몬의 견고함을 체험해볼래?", badgeName: "스톤배지", generation: 3, order: 1 },
  { id: "brawly", name: "Brawly", nameKo: "투지", title: "무로시티 체육관 관장", rank: "gym", specialty: "fighting", pokemonIds: [66, 307, 296], quote: "파도 위의 격투가, 내가 상대해줄게!", badgeName: "너클배지", generation: 3, order: 2 },
  { id: "wattson", name: "Wattson", nameKo: "철구", title: "등화시티 체육관 관장", rank: "gym", specialty: "electric", pokemonIds: [100, 82, 309, 310], quote: "와하하하! 찌릿찌릿한 배틀이다!", badgeName: "다이너모배지", generation: 3, order: 3 },
  { id: "flannery", name: "Flannery", nameKo: "아숙", title: "용암마을 체육관 관장", rank: "gym", specialty: "fire", pokemonIds: [322, 218, 323, 324], quote: "불꽃의 열정! 타오르는 배틀을 하자!", badgeName: "히트배지", generation: 3, order: 4 },
  { id: "norman", name: "Norman", nameKo: "종길", title: "등목시티 체육관 관장", rank: "gym", specialty: "normal", pokemonIds: [327, 288, 264, 289], quote: "아버지로서가 아닌 체육관 관장으로서 상대한다.", badgeName: "밸런스배지", generation: 3, order: 5 },
  { id: "winona", name: "Winona", nameKo: "소아", title: "무천시티 체육관 관장", rank: "gym", specialty: "flying", pokemonIds: [333, 357, 279, 227, 334], quote: "하늘을 지배하는 자가 배틀을 지배한다!", badgeName: "페더배지", generation: 3, order: 6 },
  { id: "tate-liza", name: "Tate & Liza", nameKo: "풍&란", title: "녹뫼시티 체육관 관장", rank: "gym", specialty: "psychic", pokemonIds: [344, 178, 337, 338], quote: "둘이서 하나! 우리의 팀워크를 봐!", badgeName: "마인드배지", generation: 3, order: 7 },
  { id: "juan", name: "Juan", nameKo: "윤진", title: "루네시티 체육관 관장", rank: "gym", specialty: "water", pokemonIds: [370, 340, 364, 342, 230], quote: "물의 예술가로서 우아한 승부를!", badgeName: "레인배지", generation: 3, order: 8 },
];

const GEN3_ELITE4: TrainerData[] = [
  { id: "sidney", name: "Sidney", nameKo: "혁진", title: "사천왕 첫 번째", rank: "elite4", specialty: "dark", pokemonIds: [262, 332, 275, 342, 359], quote: "어둠의 포켓몬과 한바탕 놀아보자!", generation: 3, order: 1 },
  { id: "phoebe", name: "Phoebe", nameKo: "후연", title: "사천왕 두 번째", rank: "elite4", specialty: "ghost", pokemonIds: [356, 354, 354, 302, 356], quote: "고스트 타입과 마음이 통하는 나를 이길 수 있을까?", generation: 3, order: 2 },
  { id: "glacia", name: "Glacia", nameKo: "미혜", title: "사천왕 세 번째", rank: "elite4", specialty: "ice", pokemonIds: [362, 364, 362, 364, 365], quote: "얼음의 우아함과 냉정함을 보여주겠어.", generation: 3, order: 3 },
  { id: "drake", name: "Drake", nameKo: "용식", title: "사천왕 네 번째", rank: "elite4", specialty: "dragon", pokemonIds: [372, 334, 230, 330, 373], quote: "바다의 남자, 드래곤과 함께 승부다!", generation: 3, order: 4 },
];

const GEN3_CHAMPION: TrainerData = {
  id: "wallace", name: "Wallace", nameKo: "윤진", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "water", pokemonIds: [321, 73, 340, 272, 130, 350], quote: "물의 예술! 우아하고 아름다운 배틀을 보여주겠어!", generation: 3, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 4세대 – 신오 (플래티나)
// ═══════════════════════════════════════════════════════════════════

const GEN4_GYM: TrainerData[] = [
  { id: "roark", name: "Roark", nameKo: "강석", title: "무쇠시티 체육관 관장", rank: "gym", specialty: "rock", pokemonIds: [74, 95, 408], quote: "바위 포켓몬의 힘을 보여주겠다!", badgeName: "콜배지", generation: 4, order: 1 },
  { id: "gardenia", name: "Gardenia", nameKo: "유채", title: "영원시티 체육관 관장", rank: "gym", specialty: "grass", pokemonIds: [387, 421, 407], quote: "풀 포켓몬이 좋아서 관장이 됐어!", badgeName: "포레스트배지", generation: 4, order: 2 },
  { id: "fantina", name: "Fantina", nameKo: "멜리사", title: "연고시티 체육관 관장", rank: "gym", specialty: "ghost", pokemonIds: [355, 93, 429], quote: "고스트와 아름다운 콘테스트를!", badgeName: "렐릭배지", generation: 4, order: 3 },
  { id: "maylene", name: "Maylene", nameKo: "자두", title: "들풀시티 체육관 관장", rank: "gym", specialty: "fighting", pokemonIds: [307, 67, 448], quote: "격투의 수련! 전력으로 간다!", badgeName: "코블배지", generation: 4, order: 4 },
  { id: "crasher-wake", name: "Crasher Wake", nameKo: "맥시", title: "노모세시티 체육관 관장", rank: "gym", specialty: "water", pokemonIds: [130, 195, 419], quote: "물의 마스크맨! 화려하게 가자!", badgeName: "펜배지", generation: 4, order: 5 },
  { id: "byron", name: "Byron", nameKo: "동관", title: "운하시티 체육관 관장", rank: "gym", specialty: "steel", pokemonIds: [82, 208, 411], quote: "강철은 모든 것을 지킨다!", badgeName: "마인배지", generation: 4, order: 6 },
  { id: "candice", name: "Candice", nameKo: "무청", title: "선단시티 체육관 관장", rank: "gym", specialty: "ice", pokemonIds: [215, 221, 460, 478], quote: "얼음처럼 시원하게 승부하자!", badgeName: "아이시클배지", generation: 4, order: 7 },
  { id: "volkner", name: "Volkner", nameKo: "전진", title: "물가시티 체육관 관장", rank: "gym", specialty: "electric", pokemonIds: [135, 26, 405, 466], quote: "지루한 날들은 끝이다! 강한 상대가 왔어!", badgeName: "비컨배지", generation: 4, order: 8 },
];

const GEN4_ELITE4: TrainerData[] = [
  { id: "aaron", name: "Aaron", nameKo: "충호", title: "사천왕 첫 번째", rank: "elite4", specialty: "bug", pokemonIds: [469, 212, 416, 214, 452], quote: "벌레 포켓몬의 아름다움을 알고 있나?", generation: 4, order: 1 },
  { id: "bertha", name: "Bertha", nameKo: "들국", title: "사천왕 두 번째", rank: "elite4", specialty: "ground", pokemonIds: [340, 472, 76, 464, 450], quote: "대지의 힘은 위대하단다.", generation: 4, order: 2 },
  { id: "flint", name: "Flint", nameKo: "대엽", title: "사천왕 세 번째", rank: "elite4", specialty: "fire", pokemonIds: [229, 136, 78, 392, 467], quote: "불꽃처럼 뜨거운 배틀을 하자!", generation: 4, order: 3 },
  { id: "lucian", name: "Lucian", nameKo: "오엽", title: "사천왕 네 번째", rank: "elite4", specialty: "psychic", pokemonIds: [122, 196, 437, 65, 475], quote: "지식과 전략이 이기는 법이지.", generation: 4, order: 4 },
];

const GEN4_CHAMPION: TrainerData = {
  id: "cynthia", name: "Cynthia", nameKo: "난천", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "normal", pokemonIds: [442, 407, 468, 448, 350, 445], quote: "준비됐어? 모든 걸 쏟아부어!", generation: 4, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 5세대 – 하나 (블랙/화이트)
// ═══════════════════════════════════════════════════════════════════

const GEN5_GYM: TrainerData[] = [
  { id: "cilan", name: "Cilan", nameKo: "덴트", title: "삼양시티 체육관 관장", rank: "gym", specialty: "grass", pokemonIds: [506, 511], quote: "풀 포켓몬과 함께 우아한 배틀을!", badgeName: "트라이배지", generation: 5, order: 1 },
  { id: "lenora", name: "Lenora", nameKo: "알로에", title: "칠보시티 체육관 관장", rank: "gym", specialty: "normal", pokemonIds: [507, 505], quote: "지식의 힘으로 승부해볼까?", badgeName: "베이직배지", generation: 5, order: 2 },
  { id: "burgh", name: "Burgh", nameKo: "아티", title: "금빛시티 체육관 관장", rank: "gym", specialty: "bug", pokemonIds: [544, 557, 542], quote: "벌레 포켓몬의 예술적 영감을 느껴봐!", badgeName: "인섹트배지", generation: 5, order: 3 },
  { id: "elesa", name: "Elesa", nameKo: "카밀레", title: "뇌문시티 체육관 관장", rank: "gym", specialty: "electric", pokemonIds: [587, 587, 523], quote: "번개처럼 눈부신 배틀! 시작할게!", badgeName: "볼트배지", generation: 5, order: 4 },
  { id: "clay", name: "Clay", nameKo: "야콘", title: "호도모에시티 체육관 관장", rank: "gym", specialty: "ground", pokemonIds: [552, 536, 530], quote: "땅의 사업가는 지지 않아!", badgeName: "퀘이크배지", generation: 5, order: 5 },
  { id: "skyla", name: "Skyla", nameKo: "풍란", title: "궤도시티 체육관 관장", rank: "gym", specialty: "flying", pokemonIds: [528, 521, 581], quote: "하늘을 나는 기분을 알려줄게!", badgeName: "제트배지", generation: 5, order: 6 },
  { id: "brycen", name: "Brycen", nameKo: "담죽", title: "설화시티 체육관 관장", rank: "gym", specialty: "ice", pokemonIds: [583, 615, 614], quote: "얼음의 고요함 속에서 승부한다.", badgeName: "아이시클배지", generation: 5, order: 7 },
  { id: "drayden", name: "Drayden", nameKo: "사간", title: "쌍용시티 체육관 관장", rank: "gym", specialty: "dragon", pokemonIds: [611, 621, 612], quote: "드래곤과 함께 수련해온 결과를 보여주마!", badgeName: "레전드배지", generation: 5, order: 8 },
];

const GEN5_ELITE4: TrainerData[] = [
  { id: "shauntal", name: "Shauntal", nameKo: "시키미", title: "사천왕 첫 번째", rank: "elite4", specialty: "ghost", pokemonIds: [563, 593, 623, 609], quote: "고스트 포켓몬의 이야기를 들려줄게.", generation: 5, order: 1 },
  { id: "grimsley", name: "Grimsley", nameKo: "기르미", title: "사천왕 두 번째", rank: "elite4", specialty: "dark", pokemonIds: [560, 510, 553, 625], quote: "운명은 직접 개척하는 거야.", generation: 5, order: 2 },
  { id: "caitlin", name: "Caitlin", nameKo: "카틀레야", title: "사천왕 세 번째", rank: "elite4", specialty: "psychic", pokemonIds: [579, 518, 561, 576], quote: "꿈의 세계에서 승부해볼까요?", generation: 5, order: 3 },
  { id: "marshal", name: "Marshal", nameKo: "연무", title: "사천왕 네 번째", rank: "elite4", specialty: "fighting", pokemonIds: [538, 539, 534, 620], quote: "격투의 도를 보여주겠다!", generation: 5, order: 4 },
];

const GEN5_CHAMPION: TrainerData = {
  id: "alder", name: "Alder", nameKo: "노간주", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "bug", pokemonIds: [617, 626, 621, 584, 589, 637], quote: "포켓몬과 함께 걷는 길! 그것이 나의 전부!", generation: 5, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 6세대 – 칼로스 (X/Y)
// ═══════════════════════════════════════════════════════════════════

const GEN6_GYM: TrainerData[] = [
  { id: "viola", name: "Viola", nameKo: "비올라", title: "백단시티 체육관 관장", rank: "gym", specialty: "bug", pokemonIds: [283, 666], quote: "벌레 포켓몬의 사진, 찍어볼까?", badgeName: "버그배지", generation: 6, order: 1 },
  { id: "grant", name: "Grant", nameKo: "자크로", title: "벽록시티 체육관 관장", rank: "gym", specialty: "rock", pokemonIds: [698, 696], quote: "절벽을 오르듯 도전을 즐겨!", badgeName: "클리프배지", generation: 6, order: 2 },
  { id: "korrina", name: "Korrina", nameKo: "코르니", title: "살롱시티 체육관 관장", rank: "gym", specialty: "fighting", pokemonIds: [619, 67, 701], quote: "메가진화의 힘! 보여줄게!", badgeName: "럼블배지", generation: 6, order: 3 },
  { id: "ramos", name: "Ramos", nameKo: "후쿠지", title: "쑥마을 체육관 관장", rank: "gym", specialty: "grass", pokemonIds: [189, 70, 673], quote: "자연을 사랑하는 마음으로 승부한다네.", badgeName: "플랜트배지", generation: 6, order: 4 },
  { id: "clemont", name: "Clemont", nameKo: "시트론", title: "미르시티 체육관 관장", rank: "gym", specialty: "electric", pokemonIds: [587, 82, 695], quote: "과학의 힘은 위대하다! 번개를 맞아봐!", badgeName: "볼티지배지", generation: 6, order: 5 },
  { id: "valerie", name: "Valerie", nameKo: "마슈", title: "향전시티 체육관 관장", rank: "gym", specialty: "fairy", pokemonIds: [122, 303, 700], quote: "요정 타입의 신비로운 매력을...", badgeName: "페어리배지", generation: 6, order: 6 },
  { id: "olympia", name: "Olympia", nameKo: "고지카", title: "혁신시티 체육관 관장", rank: "gym", specialty: "psychic", pokemonIds: [561, 199, 678], quote: "별이 너의 미래를 비춘다.", badgeName: "사이킥배지", generation: 6, order: 7 },
  { id: "wulfric", name: "Wulfric", nameKo: "우르프", title: "영설시티 체육관 관장", rank: "gym", specialty: "ice", pokemonIds: [460, 713, 615], quote: "얼음은 강하지만 따뜻한 마음도 있지!", badgeName: "아이스버그배지", generation: 6, order: 8 },
];

const GEN6_ELITE4: TrainerData[] = [
  { id: "wikstrom", name: "Wikstrom", nameKo: "간피", title: "사천왕 첫 번째", rank: "elite4", specialty: "steel", pokemonIds: [707, 476, 681, 212], quote: "기사도의 정신으로 상대하겠다!", generation: 6, order: 1 },
  { id: "malva", name: "Malva", nameKo: "파키라", title: "사천왕 두 번째", rank: "elite4", specialty: "fire", pokemonIds: [668, 663, 324, 609], quote: "불꽃의 정열로 태워주겠어.", generation: 6, order: 2 },
  { id: "drasna", name: "Drasna", nameKo: "드라세나", title: "사천왕 세 번째", rank: "elite4", specialty: "dragon", pokemonIds: [691, 334, 715, 621], quote: "드래곤 포켓몬이 좋아서 말이야~", generation: 6, order: 3 },
  { id: "siebold", name: "Siebold", nameKo: "즈미", title: "사천왕 네 번째", rank: "elite4", specialty: "water", pokemonIds: [693, 121, 130, 689], quote: "물과 요리, 그리고 배틀은 모두 예술이다.", generation: 6, order: 4 },
];

const GEN6_CHAMPION: TrainerData = {
  id: "diantha", name: "Diantha", nameKo: "카르네", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "normal", pokemonIds: [701, 699, 697, 706, 711, 282], quote: "배우이자 챔피언! 아름다운 배틀을!", generation: 6, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 7세대 – 알로라 (썬/문)  ※ 체육관 대신 섬의 왕/여왕
// ═══════════════════════════════════════════════════════════════════

const GEN7_GYM: TrainerData[] = [
  { id: "hala-kahuna", name: "Hala", nameKo: "할라", title: "멜레멜레섬 섬킹", rank: "gym", specialty: "fighting", pokemonIds: [56, 296, 739], quote: "알로라의 격투 정신! 받아봐라!", badgeName: "멜레멜레 클리어", generation: 7, order: 1 },
  { id: "olivia-kahuna", name: "Olivia", nameKo: "라이치", title: "아칼라섬 섬퀸", rank: "gym", specialty: "rock", pokemonIds: [299, 525, 745], quote: "바위의 아름다움을 알아볼 줄 아는 자만이!", badgeName: "아칼라 클리어", generation: 7, order: 2 },
  { id: "nanu", name: "Nanu", nameKo: "자우지", title: "울라울라섬 섬킹", rank: "gym", specialty: "dark", pokemonIds: [302, 552, 53], quote: "귀찮지만... 한 판 하자.", badgeName: "울라울라 클리어", generation: 7, order: 3 },
  { id: "hapu", name: "Hapu", nameKo: "하푸", title: "포니섬 섬퀸", rank: "gym", specialty: "ground", pokemonIds: [51, 423, 330, 750], quote: "대지를 수호하는 자, 상대해주겠어!", badgeName: "포니 클리어", generation: 7, order: 4 },
];

const GEN7_ELITE4: TrainerData[] = [
  { id: "hala", name: "Hala", nameKo: "할라", title: "사천왕 첫 번째", rank: "elite4", specialty: "fighting", pokemonIds: [297, 57, 760, 62, 740], quote: "격투의 혼으로 상대하겠다!", generation: 7, order: 1 },
  { id: "olivia-e4", name: "Olivia", nameKo: "라이치", title: "사천왕 두 번째", rank: "elite4", specialty: "rock", pokemonIds: [369, 703, 76, 476, 745], quote: "보석처럼 빛나는 승부를!", generation: 7, order: 2 },
  { id: "acerola", name: "Acerola", nameKo: "아세로라", title: "사천왕 세 번째", rank: "elite4", specialty: "ghost", pokemonIds: [302, 426, 781, 478, 770], quote: "유령 친구들과 놀아줄게~", generation: 7, order: 3 },
  { id: "kahili", name: "Kahili", nameKo: "카힐리", title: "사천왕 네 번째", rank: "elite4", specialty: "flying", pokemonIds: [227, 169, 741, 630, 733], quote: "골프처럼 정확한 승부를!", generation: 7, order: 4 },
];

const GEN7_CHAMPION: TrainerData = {
  id: "kukui", name: "Kukui", nameKo: "쿠쿠이", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "normal", pokemonIds: [745, 38, 628, 462, 143, 727], quote: "알로라! 마지막 시련이다, 즐겨!", generation: 7, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 8세대 – 가라르 (소드/실드)
// ═══════════════════════════════════════════════════════════════════

const GEN8_GYM: TrainerData[] = [
  { id: "milo", name: "Milo", nameKo: "야콘", title: "터프시티 체육관 관장", rank: "gym", specialty: "grass", pokemonIds: [829, 830], quote: "풀 포켓몬과 함께 즐거운 배틀을!", badgeName: "그래스배지", generation: 8, order: 1 },
  { id: "nessa", name: "Nessa", nameKo: "야청", title: "바운스타운 체육관 관장", rank: "gym", specialty: "water", pokemonIds: [118, 846, 834], quote: "물결의 모델이 상대해줄게!", badgeName: "워터배지", generation: 8, order: 2 },
  { id: "kabu", name: "Kabu", nameKo: "카부", title: "에진타운 체육관 관장", rank: "gym", specialty: "fire", pokemonIds: [38, 59, 851], quote: "불꽃의 베테랑이 상대한다!", badgeName: "파이어배지", generation: 8, order: 3 },
  { id: "bea", name: "Bea", nameKo: "채두", title: "래터포드 체육관 관장", rank: "gym", specialty: "fighting", pokemonIds: [237, 675, 865, 68], quote: "격투의 도를 보여주겠어.", badgeName: "파이팅배지", generation: 8, order: 4 },
  { id: "opal", name: "Opal", nameKo: "포플러", title: "밸런뮤어 체육관 관장", rank: "gym", specialty: "fairy", pokemonIds: [110, 303, 468, 869], quote: "퀴즈에 답하면서 배틀하렴!", badgeName: "페어리배지", generation: 8, order: 5 },
  { id: "gordie", name: "Gordie", nameKo: "마크와", title: "서커스타운 체육관 관장", rank: "gym", specialty: "rock", pokemonIds: [689, 213, 874, 839], quote: "바위 위의 멋진 승부!", badgeName: "록배지", generation: 8, order: 6 },
  { id: "piers", name: "Piers", nameKo: "네즈", title: "스파이크타운 체육관 관장", rank: "gym", specialty: "dark", pokemonIds: [560, 687, 435, 862], quote: "다이맥스 없이도 이길 수 있다!", badgeName: "다크배지", generation: 8, order: 7 },
  { id: "raihan", name: "Raihan", nameKo: "킹바드레", title: "해머록 체육관 관장", rank: "gym", specialty: "dragon", pokemonIds: [526, 330, 844, 884], quote: "날씨를 지배하는 드래곤 마스터!", badgeName: "드래곤배지", generation: 8, order: 8 },
];

const GEN8_ELITE4: TrainerData[] = [
  { id: "marnie", name: "Marnie", nameKo: "마리", title: "가라르 강자 첫 번째", rank: "elite4", specialty: "dark", pokemonIds: [510, 454, 877, 861], quote: "내 오빠 응원단은 신경쓰지 마.", generation: 8, order: 1 },
  { id: "hop", name: "Hop", nameKo: "홉", title: "가라르 강자 두 번째", rank: "elite4", specialty: "normal", pokemonIds: [832, 143, 823, 871], quote: "형의 뒤를 이을 거야!", generation: 8, order: 2 },
  { id: "bede", name: "Bede", nameKo: "비트", title: "가라르 강자 세 번째", rank: "elite4", specialty: "fairy", pokemonIds: [303, 282, 78, 858], quote: "내 재능을 보여줄 때가 왔군.", generation: 8, order: 3 },
  { id: "raihan-e4", name: "Raihan", nameKo: "킹바드레", title: "가라르 강자 네 번째", rank: "elite4", specialty: "dragon", pokemonIds: [324, 706, 776, 330, 884], quote: "셀카 찍으면서 이겨줄게!", generation: 8, order: 4 },
];

const GEN8_CHAMPION: TrainerData = {
  id: "leon", name: "Leon", nameKo: "단델", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "normal", pokemonIds: [681, 887, 612, 537, 6, 812], quote: "무패의 챔피언! 최강의 배틀을 보여주겠어!", generation: 8, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 9세대 – 팔데아 (스칼렛/바이올렛)
// ═══════════════════════════════════════════════════════════════════

const GEN9_GYM: TrainerData[] = [
  { id: "katy", name: "Katy", nameKo: "카에데", title: "테이블시티 체육관 관장", rank: "gym", specialty: "bug", pokemonIds: [919, 917, 216], quote: "제과점 벌레 포켓몬과 달콤한 배틀을!", badgeName: "버그배지", generation: 9, order: 1 },
  { id: "brassius", name: "Brassius", nameKo: "콜사", title: "세르클시티 체육관 관장", rank: "gym", specialty: "grass", pokemonIds: [548, 928, 185], quote: "예술은 폭발이다! 풀 포켓몬아!", badgeName: "그래스배지", generation: 9, order: 2 },
  { id: "iono", name: "Iono", nameKo: "나모", title: "하코시티 체육관 관장", rank: "gym", specialty: "electric", pokemonIds: [940, 939, 404, 429], quote: "도우너! 전기 배틀 방송 시작!", badgeName: "일렉트릭배지", generation: 9, order: 3 },
  { id: "kofu", name: "Kofu", nameKo: "하이다이", title: "나시체시티 체육관 관장", rank: "gym", specialty: "water", pokemonIds: [976, 961, 740], quote: "바다의 맛! 셰프의 배틀!", badgeName: "워터배지", generation: 9, order: 4 },
  { id: "larry-gym", name: "Larry", nameKo: "아오키", title: "카라프시티 체육관 관장", rank: "gym", specialty: "normal", pokemonIds: [775, 982, 398], quote: "평범한 회사원의 평범한 배틀.", badgeName: "노말배지", generation: 9, order: 5 },
  { id: "ryme", name: "Ryme", nameKo: "라이무", title: "프레사시티 체육관 관장", rank: "gym", specialty: "ghost", pokemonIds: [354, 778, 972, 849], quote: "고스트 랩 배틀! 시작이야!", badgeName: "고스트배지", generation: 9, order: 6 },
  { id: "tulip", name: "Tulip", nameKo: "립", title: "벨로시티 체육관 관장", rank: "gym", specialty: "psychic", pokemonIds: [981, 282, 956, 671], quote: "뷰티와 에스퍼의 완벽한 조합.", badgeName: "사이킥배지", generation: 9, order: 7 },
  { id: "grusha", name: "Grusha", nameKo: "구루샤", title: "글래시어시티 체육관 관장", rank: "gym", specialty: "ice", pokemonIds: [873, 614, 975, 334], quote: "얼음 위의 전설! 상대해줄게.", badgeName: "아이스배지", generation: 9, order: 8 },
];

const GEN9_ELITE4: TrainerData[] = [
  { id: "rika", name: "Rika", nameKo: "칠리", title: "사천왕 첫 번째", rank: "elite4", specialty: "ground", pokemonIds: [340, 323, 232, 51, 980], quote: "대지를 흔드는 배틀을 하자!", generation: 9, order: 1 },
  { id: "poppy", name: "Poppy", nameKo: "포피", title: "사천왕 두 번째", rank: "elite4", specialty: "steel", pokemonIds: [879, 462, 437, 823, 959], quote: "강철처럼 단단한 나를 이겨봐!", generation: 9, order: 2 },
  { id: "larry-e4", name: "Larry", nameKo: "아오키", title: "사천왕 세 번째", rank: "elite4", specialty: "flying", pokemonIds: [357, 741, 334, 398, 973], quote: "...또 일이야. 가자.", generation: 9, order: 3 },
  { id: "hassel", name: "Hassel", nameKo: "핫셀", title: "사천왕 네 번째", rank: "elite4", specialty: "dragon", pokemonIds: [715, 612, 691, 841, 998], quote: "드래곤의 예술을 보여주겠다!", generation: 9, order: 4 },
];

const GEN9_CHAMPION: TrainerData = {
  id: "geeta", name: "Geeta", nameKo: "오모다카", title: "포켓몬 리그 챔피언", rank: "champion", specialty: "normal", pokemonIds: [956, 673, 976, 713, 983, 970], quote: "톱 챔피언으로서 전력으로 상대한다.", generation: 9, order: 1,
};

// ═══════════════════════════════════════════════════════════════════
// 세대별 모음 + 전체 목록
// ═══════════════════════════════════════════════════════════════════

export interface GenerationTrainers {
  generation: number;
  label: string;
  gym: TrainerData[];
  elite4: TrainerData[];
  champion: TrainerData;
}

export const GENERATIONS_TRAINERS: GenerationTrainers[] = [
  { generation: 1, label: "1세대 (관동)", gym: GEN1_GYM, elite4: GEN1_ELITE4, champion: GEN1_CHAMPION },
  { generation: 2, label: "2세대 (성도)", gym: GEN2_GYM, elite4: GEN2_ELITE4, champion: GEN2_CHAMPION },
  { generation: 3, label: "3세대 (호연)", gym: GEN3_GYM, elite4: GEN3_ELITE4, champion: GEN3_CHAMPION },
  { generation: 4, label: "4세대 (신오)", gym: GEN4_GYM, elite4: GEN4_ELITE4, champion: GEN4_CHAMPION },
  { generation: 5, label: "5세대 (하나)", gym: GEN5_GYM, elite4: GEN5_ELITE4, champion: GEN5_CHAMPION },
  { generation: 6, label: "6세대 (칼로스)", gym: GEN6_GYM, elite4: GEN6_ELITE4, champion: GEN6_CHAMPION },
  { generation: 7, label: "7세대 (알로라)", gym: GEN7_GYM, elite4: GEN7_ELITE4, champion: GEN7_CHAMPION },
  { generation: 8, label: "8세대 (가라르)", gym: GEN8_GYM, elite4: GEN8_ELITE4, champion: GEN8_CHAMPION },
  { generation: 9, label: "9세대 (팔데아)", gym: GEN9_GYM, elite4: GEN9_ELITE4, champion: GEN9_CHAMPION },
];

export const ALL_TRAINERS: TrainerData[] = GENERATIONS_TRAINERS.flatMap((g) => [
  ...g.gym,
  ...g.elite4,
  g.champion,
]);

export function getTrainerById(id: string): TrainerData | undefined {
  return ALL_TRAINERS.find((t) => t.id === id);
}
