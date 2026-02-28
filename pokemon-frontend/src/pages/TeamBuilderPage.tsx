import { useState, useEffect, useCallback } from "react";
import type { PokemonListItem, PokemonDetail } from "@/data/pokemon";
import { LoadingScreen } from "@/components/common";
import { TeamSlots } from "@/components/team/TeamSlots";
import { PokemonPicker } from "@/components/team/PokemonPicker";
import { TeamAnalysis } from "@/components/team/TeamAnalysis";
import { usePokemonList } from "@/hooks/usePokemonList";
import { fetchPokemonDetail } from "@/lib/pokeapi";

export function TeamBuilderPage() {
  const { pokemon: allPokemon, loading: listLoading } = usePokemonList();

  const [team, setTeam] = useState<(PokemonListItem | null)[]>(Array(6).fill(null));
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
        results.forEach((detail) => {
          if (detail) next.set(detail.id, detail);
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

  const reorderTeam = (fromIndex: number, toIndex: number) => {
    setTeam((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  if (listLoading) {
    return <LoadingScreen message="포켓몬 목록 불러오는 중..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-lg text-foreground sm:text-xl">Team Builder</h1>
        <p className="mt-1 text-sm text-secondary-custom">6마리의 포켓몬으로 최강의 팀을 구성하세요</p>
      </div>

      <TeamSlots team={team} onAdd={openPicker} onRemove={removeFromTeam} onReorder={reorderTeam} />

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
    </div>
  );
}
