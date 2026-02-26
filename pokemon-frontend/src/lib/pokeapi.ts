import type { PokemonType, PokemonListItem, PokemonDetail, PokemonStats, PokemonMove } from "@/data/pokemon";

const POKEAPI_GRAPHQL_URL = "https://beta.pokeapi.co/graphql/v1beta";

async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(POKEAPI_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}

const POKEMON_LIST_QUERY = `
  query GetPokemonList($limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(
      limit: $limit
      offset: $offset
      order_by: { id: asc }
      where: { is_default: { _eq: true } }
    ) {
      id
      name
      pokemon_v2_pokemontypes(order_by: { slot: asc }) {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesnames(
          where: { pokemon_v2_language: { name: { _eq: "ko" } } }
        ) {
          name
        }
      }
    }
  }
`;

interface RawListPokemon {
  id: number;
  name: string;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: { name: string };
  }[];
  pokemon_v2_pokemonspecy: {
    pokemon_v2_pokemonspeciesnames: { name: string }[];
  };
}

function transformListItem(raw: RawListPokemon): PokemonListItem {
  const koNames = raw.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames;
  return {
    id: raw.id,
    name: raw.name.charAt(0).toUpperCase() + raw.name.slice(1),
    nameKo: koNames.length > 0 ? koNames[0].name : raw.name,
    types: raw.pokemon_v2_pokemontypes.map(
      (t) => t.pokemon_v2_type.name as PokemonType
    ),
  };
}

export async function fetchPokemonList(
  limit = 1025,
  offset = 0
): Promise<PokemonListItem[]> {
  const data = await fetchGraphQL<{
    pokemon_v2_pokemon: RawListPokemon[];
  }>(POKEMON_LIST_QUERY, { limit, offset });

  return data.pokemon_v2_pokemon.map(transformListItem);
}

const POKEMON_DETAIL_QUERY = `
  query GetPokemonDetail($id: Int!) {
    pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes(order_by: { slot: asc }) {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats(order_by: { stat_id: asc }) {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonmoves(
        where: {
          pokemon_v2_movelearnmethod: { name: { _eq: "level-up" } }
          pokemon_v2_move: { power: { _gt: 0 } }
        }
        order_by: { level: desc }
        limit: 20
      ) {
        pokemon_v2_move {
          name
          power
          accuracy
          pokemon_v2_type {
            name
          }
          pokemon_v2_movedamageclass {
            name
          }
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesnames(
          where: { pokemon_v2_language: { name: { _eq: "ko" } } }
        ) {
          name
        }
        pokemon_v2_pokemonspeciesflavortexts(
          where: { pokemon_v2_language: { name: { _eq: "ko" } } }
          limit: 1
          order_by: { version_id: desc }
        ) {
          flavor_text
        }
      }
    }
  }
`;

interface RawDetailPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: { name: string };
  }[];
  pokemon_v2_pokemonstats: {
    base_stat: number;
    pokemon_v2_stat: { name: string };
  }[];
  pokemon_v2_pokemonmoves: {
    pokemon_v2_move: {
      name: string;
      power: number;
      accuracy: number;
      pokemon_v2_type: { name: string };
      pokemon_v2_movedamageclass: { name: string };
    };
  }[];
  pokemon_v2_pokemonspecy: {
    pokemon_v2_pokemonspeciesnames: { name: string }[];
    pokemon_v2_pokemonspeciesflavortexts: { flavor_text: string }[];
  };
}

const STAT_NAME_MAP: Record<string, keyof PokemonStats> = {
  hp: "hp",
  attack: "attack",
  defense: "defense",
  "special-attack": "spAtk",
  "special-defense": "spDef",
  speed: "speed",
};

function cleanFlavorText(text: string): string {
  return text.replace(/[\n\r\f]/g, " ").replace(/\s+/g, " ").trim();
}

function capitalizeMoveName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function transformDetail(raw: RawDetailPokemon): PokemonDetail {
  const koNames = raw.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames;
  const flavorTexts = raw.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesflavortexts;

  const stats: PokemonStats = { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };
  for (const s of raw.pokemon_v2_pokemonstats) {
    const key = STAT_NAME_MAP[s.pokemon_v2_stat.name];
    if (key) stats[key] = s.base_stat;
  }

  const seenMoves = new Set<string>();
  const uniqueMoves = raw.pokemon_v2_pokemonmoves.filter((m) => {
    const name = m.pokemon_v2_move.name;
    if (seenMoves.has(name)) return false;
    seenMoves.add(name);
    return true;
  });

  const moves: PokemonMove[] = uniqueMoves.slice(0, 4).map((m) => ({
    name: capitalizeMoveName(m.pokemon_v2_move.name),
    type: m.pokemon_v2_move.pokemon_v2_type.name as PokemonType,
    power: m.pokemon_v2_move.power,
    accuracy: m.pokemon_v2_move.accuracy,
    category: m.pokemon_v2_move.pokemon_v2_movedamageclass.name as "physical" | "special" | "status",
  }));

  return {
    id: raw.id,
    name: raw.name.charAt(0).toUpperCase() + raw.name.slice(1),
    nameKo: koNames.length > 0 ? koNames[0].name : raw.name,
    types: raw.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name as PokemonType),
    stats,
    moves,
    height: raw.height / 10,
    weight: raw.weight / 10,
    description: flavorTexts.length > 0 ? cleanFlavorText(flavorTexts[0].flavor_text) : "",
  };
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const data = await fetchGraphQL<{
    pokemon_v2_pokemon: RawDetailPokemon[];
  }>(POKEMON_DETAIL_QUERY, { id });

  if (data.pokemon_v2_pokemon.length === 0) {
    throw new Error(`Pokemon #${id} not found`);
  }

  return transformDetail(data.pokemon_v2_pokemon[0]);
}
