import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { apiMyFavorites, apiAddFavorite, apiRemoveFavorite } from "@/lib/api";

export function useFavorites() {
  const { token } = useAuthContext();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;
    apiMyFavorites(token)
      .then((favs) => setFavoriteIds(new Set(favs.map((f) => f.pokemonId))))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [token]);

  const isFavorite = useCallback((pokemonId: number) => favoriteIds.has(pokemonId), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (pokemonId: number) => {
      if (!token) return;
      const wasFavorite = favoriteIds.has(pokemonId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.delete(pokemonId);
        else next.add(pokemonId);
        return next;
      });
      try {
        if (wasFavorite) {
          await apiRemoveFavorite(token, pokemonId);
        } else {
          await apiAddFavorite(token, pokemonId);
        }
      } catch {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFavorite) next.add(pokemonId);
          else next.delete(pokemonId);
          return next;
        });
      }
    },
    [token, favoriteIds],
  );

  return { favoriteIds, loading, isFavorite, toggleFavorite } as const;
}
