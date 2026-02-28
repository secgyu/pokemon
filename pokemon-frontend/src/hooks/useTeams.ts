import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { type TeamResult, apiMyTeams, apiCreateTeam, apiUpdateTeam, apiDeleteTeam } from "@/lib/api";

export function useTeams() {
  const { token } = useAuthContext();
  const [teams, setTeams] = useState<TeamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTeams = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiMyTeams(token);
      setTeams(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const saveTeam = useCallback(
    async (name: string, pokemonIds: number[]) => {
      if (!token) return;
      setSaving(true);
      try {
        const created = await apiCreateTeam(token, name, pokemonIds);
        setTeams((prev) => [created, ...prev]);
      } finally {
        setSaving(false);
      }
    },
    [token],
  );

  const updateTeam = useCallback(
    async (id: string, input: { name?: string; pokemonIds?: number[] }) => {
      if (!token) return;
      setSaving(true);
      try {
        const updated = await apiUpdateTeam(token, id, input);
        setTeams((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } finally {
        setSaving(false);
      }
    },
    [token],
  );

  const deleteTeam = useCallback(
    async (id: string) => {
      if (!token) return;
      try {
        await apiDeleteTeam(token, id);
        setTeams((prev) => prev.filter((t) => t.id !== id));
      } catch {
        /* ignore */
      }
    },
    [token],
  );

  return { teams, loading, saving, saveTeam, updateTeam, deleteTeam, reload: loadTeams } as const;
}
