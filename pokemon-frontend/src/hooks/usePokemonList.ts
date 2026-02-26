import { useState, useEffect } from "react";
import type { PokemonListItem } from "@/data/pokemon";
import { fetchPokemonList } from "@/lib/pokeapi";

interface UsePokemonListResult {
  pokemon: PokemonListItem[];
  loading: boolean;
  error: string | null;
}

let cachedList: PokemonListItem[] | null = null;

export function usePokemonList(): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>(cachedList ?? []);
  const [loading, setLoading] = useState(!cachedList);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedList) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPokemonList();
        if (!cancelled) {
          cachedList = data;
          setPokemon(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "데이터를 불러올 수 없습니다");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { pokemon, loading, error };
}
