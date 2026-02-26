import { useState, useEffect } from "react";
import type { PokemonDetail } from "@/data/pokemon";
import { fetchPokemonDetail } from "@/lib/pokeapi";

interface UsePokemonDetailResult {
  detail: PokemonDetail | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<number, PokemonDetail>();

export function usePokemonDetail(id: number | null): UsePokemonDetailResult {
  const [detail, setDetail] = useState<PokemonDetail | null>(
    id ? cache.get(id) ?? null : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setDetail(null);
      return;
    }

    const cached = cache.get(id);
    if (cached) {
      setDetail(cached);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setDetail(null);
        const data = await fetchPokemonDetail(id!);
        if (!cancelled) {
          cache.set(id!, data);
          setDetail(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "상세 정보를 불러올 수 없습니다");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  return { detail, loading, error };
}
