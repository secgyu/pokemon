import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import type { PokemonListItem, PokemonDetail } from "@/data/pokemon";
import type { TeamResult } from "@/lib/api";
import { LoadingScreen } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamSlots } from "@/components/team/TeamSlots";
import { PokemonPicker } from "@/components/team/PokemonPicker";
import { TeamAnalysis } from "@/components/team/TeamAnalysis";
import { SavedTeamsList } from "@/components/team/SavedTeamsList";
import { usePokemonList } from "@/hooks/usePokemonList";
import { useTeams } from "@/hooks/useTeams";
import { fetchPokemonDetail } from "@/lib/pokeapi";

export function TeamBuilderPage() {
  const { pokemon: allPokemon, loading: listLoading } = usePokemonList();
  const { teams, loading: teamsLoading, saving, saveTeam, deleteTeam } = useTeams();

  const [team, setTeam] = useState<(PokemonListItem | null)[]>(Array(6).fill(null));
  const [teamName, setTeamName] = useState("");
  const [teamDetails, setTeamDetails] = useState<Map<number, PokemonDetail>>(new Map());
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSlot, setPickerSlot] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const activeTeam = team.filter(Boolean) as PokemonListItem[];

  const loadTeamDetails = useCallback(async (members: PokemonListItem[]) => {
    if (members.length === 0) return;
    setDetailsLoading(true);
    try {
      const results = await Promise.all(members.map((m) => fetchPokemonDetail(m.id).catch(() => null)));
      setTeamDetails((prev) => {
        const next = new Map(prev);
        results.forEach((d) => {
          if (d) next.set(d.id, d);
        });
        return next;
      });
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    const needsFetch = activeTeam.filter((p) => !teamDetails.has(p.id));
    if (needsFetch.length > 0) loadTeamDetails(needsFetch);
  }, [activeTeam, teamDetails, loadTeamDetails]);

  const openPicker = (slot: number) => {
    setPickerSlot(slot);
    setShowPicker(true);
  };

  const addToTeam = (pokemon: PokemonListItem) => {
    setTeam((prev) => {
      const next = [...prev];
      next[pickerSlot] = pokemon;
      return next;
    });
    setShowPicker(false);
  };

  const removeFromTeam = (slot: number) => {
    setTeam((prev) => {
      const next = [...prev];
      next[slot] = null;
      return next;
    });
  };

  const reorderTeam = (from: number, to: number) => {
    setTeam((prev) => {
      const next = [...prev];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  };

  const handleSave = async () => {
    const ids = activeTeam.map((p) => p.id);
    if (ids.length === 0 || !teamName.trim()) return;
    await saveTeam(teamName.trim(), ids);
    setTeamName("");
  };

  const handleLoadSaved = (saved: TeamResult) => {
    const loaded: (PokemonListItem | null)[] = saved.pokemonIds.map((id) => {
      const found = allPokemon.find((p) => p.id === id);
      return found ?? null;
    });
    while (loaded.length < 6) loaded.push(null);
    setTeam(loaded.slice(0, 6));
    setTeamName(saved.name);
  };

  if (listLoading) return <LoadingScreen message="포켓몬 목록 불러오는 중..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-lg text-foreground sm:text-xl">Team Builder</h1>
        <p className="mt-1 text-sm text-secondary-custom">6마리의 포켓몬으로 최강의 팀을 구성하세요</p>
      </div>

      <TeamSlots team={team} onAdd={openPicker} onRemove={removeFromTeam} onReorder={reorderTeam} />

      {activeTeam.length > 0 && (
        <div className="flex gap-2">
          <Input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="팀 이름 (예: 불꽃 공격팀)"
            className="flex-1"
            maxLength={30}
          />
          <Button onClick={handleSave} disabled={saving || !teamName.trim()} className="gap-2 cursor-pointer">
            <Save className="h-4 w-4" />
            {saving ? "저장중..." : "저장"}
          </Button>
        </div>
      )}

      {showPicker && (
        <PokemonPicker
          slot={pickerSlot}
          allPokemon={allPokemon}
          team={team}
          onSelect={addToTeam}
          onClose={() => setShowPicker(false)}
        />
      )}

      {activeTeam.length > 0 && (
        <TeamAnalysis
          team={activeTeam}
          details={teamDetails}
          detailsLoading={detailsLoading}
          open={showAnalysis}
          onToggle={() => setShowAnalysis(!showAnalysis)}
        />
      )}

      <SavedTeamsList teams={teams} loading={teamsLoading} onLoad={handleLoadSaved} onDelete={deleteTeam} />
    </div>
  );
}
