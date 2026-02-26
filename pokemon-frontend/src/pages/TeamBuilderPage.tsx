import { useState } from "react";
import { Plus, X, Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  POKEMON_DATA,
  ALL_TYPES,
  TYPE_COLORS,
  getSpriteUrl,
  formatPokedexNumber,
  type Pokemon,
  type PokemonType,
} from "@/data/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { StatBar } from "@/components/pokemon/StatBar";

const TYPE_EFFECTIVENESS: Partial<Record<PokemonType, PokemonType[]>> = {
  normal: [],
  fire: ["grass", "ice", "bug", "steel"],
  water: ["fire", "ground", "rock"],
  electric: ["water", "flying"],
  grass: ["water", "ground", "rock"],
  ice: ["grass", "ground", "flying", "dragon"],
  fighting: ["normal", "ice", "rock", "dark", "steel"],
  poison: ["grass", "fairy"],
  ground: ["fire", "electric", "poison", "rock", "steel"],
  flying: ["grass", "fighting", "bug"],
  psychic: ["fighting", "poison"],
  bug: ["grass", "psychic", "dark"],
  rock: ["fire", "ice", "flying", "bug"],
  ghost: ["ghost", "psychic"],
  dragon: ["dragon"],
  dark: ["ghost", "psychic"],
  steel: ["ice", "rock", "fairy"],
  fairy: ["fighting", "dragon", "dark"],
};

const TYPE_WEAKNESS: Partial<Record<PokemonType, PokemonType[]>> = {
  normal: ["fighting"],
  fire: ["water", "ground", "rock"],
  water: ["electric", "grass"],
  electric: ["ground"],
  grass: ["fire", "ice", "poison", "flying", "bug"],
  ice: ["fire", "fighting", "rock", "steel"],
  fighting: ["flying", "psychic", "fairy"],
  poison: ["ground", "psychic"],
  ground: ["water", "grass", "ice"],
  flying: ["electric", "ice", "rock"],
  psychic: ["bug", "ghost", "dark"],
  bug: ["fire", "flying", "rock"],
  rock: ["water", "grass", "fighting", "ground", "steel"],
  ghost: ["ghost", "dark"],
  dragon: ["ice", "dragon", "fairy"],
  dark: ["fighting", "bug", "fairy"],
  steel: ["fire", "fighting", "ground"],
  fairy: ["poison", "steel"],
};

function getTeamWeaknesses(team: Pokemon[]): Map<PokemonType, number> {
  const counts = new Map<PokemonType, number>();
  for (const pokemon of team) {
    const weaknesses = new Set<PokemonType>();
    for (const type of pokemon.types) {
      const ws = TYPE_WEAKNESS[type] || [];
      ws.forEach((w) => weaknesses.add(w));
    }
    weaknesses.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
  }
  return counts;
}

function getTeamCoverage(team: Pokemon[]): Set<PokemonType> {
  const covered = new Set<PokemonType>();
  for (const pokemon of team) {
    for (const type of pokemon.types) {
      const eff = TYPE_EFFECTIVENESS[type] || [];
      eff.forEach((e) => covered.add(e));
    }
    for (const move of pokemon.moves) {
      const eff = TYPE_EFFECTIVENESS[move.type] || [];
      eff.forEach((e) => covered.add(e));
    }
  }
  return covered;
}

export function TeamBuilderPage() {
  const [team, setTeam] = useState<(Pokemon | null)[]>(Array(6).fill(null));
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<number>(0);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const activeTeam = team.filter(Boolean) as Pokemon[];
  const weaknesses = getTeamWeaknesses(activeTeam);
  const coverage = getTeamCoverage(activeTeam);

  const criticalWeaknesses = [...weaknesses.entries()].filter(([, count]) => count >= 3).map(([type]) => type);

  const uncoveredTypes = ALL_TYPES.filter((t) => !coverage.has(t));

  const openPicker = (slot: number) => {
    setPickerSlot(slot);
    setShowPicker(true);
  };

  const addToTeam = (pokemon: Pokemon) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-lg text-foreground sm:text-xl">Team Builder</h1>
        <p className="mt-1 text-sm text-secondary-custom">6마리의 포켓몬으로 최강의 팀을 구성하세요</p>
      </div>

      {/* Team Slots */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {team.map((pokemon, i) =>
          pokemon ? (
            <div
              key={i}
              className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-3 transition-all hover:border-[#4a4a8a]"
            >
              <button
                onClick={() => removeFromTeam(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#cc0000] text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
              <img src={getSpriteUrl(pokemon.id)} alt={pokemon.name} className="h-14 w-14 sprite-pixel" />
              <p className="mt-1 text-[10px] font-semibold text-foreground truncate w-full text-center">
                {pokemon.nameKo}
              </p>
              <div className="mt-1 flex gap-0.5">
                {pokemon.types.map((t) => (
                  <span key={t} className="h-1.5 w-4 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }} />
                ))}
              </div>
            </div>
          ) : (
            <button
              key={i}
              onClick={() => openPicker(i)}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-3 py-6 transition-all hover:border-[#4a4a8a] hover:bg-card cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-border">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">슬롯 {i + 1}</p>
            </button>
          ),
        )}
      </div>

      {/* Pokemon Picker */}
      {showPicker && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">슬롯 {pickerSlot + 1}에 추가할 포켓몬 선택</h3>
            <button
              onClick={() => setShowPicker(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ScrollArea className="h-[280px]">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4">
              {POKEMON_DATA.map((pokemon) => {
                const alreadyInTeam = team.some((t) => t?.id === pokemon.id);
                return (
                  <button
                    key={pokemon.id}
                    onClick={() => !alreadyInTeam && addToTeam(pokemon)}
                    disabled={alreadyInTeam}
                    className={`flex items-center gap-2 rounded-lg border border-border p-2 transition-all cursor-pointer ${
                      alreadyInTeam ? "cursor-not-allowed opacity-30" : "hover:border-[#4a4a8a] hover:bg-[#12121a]"
                    }`}
                  >
                    <img src={getSpriteUrl(pokemon.id)} alt={pokemon.name} className="h-10 w-10 sprite-pixel" />
                    <div className="text-left min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{pokemon.nameKo}</p>
                      <p className="text-[10px] text-muted-foreground">{formatPokedexNumber(pokemon.id)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Team Analysis */}
      {activeTeam.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex w-full items-center justify-between px-4 py-3 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">팀 분석</h3>
            </div>
            {showAnalysis ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showAnalysis && (
            <div className="space-y-4 px-4 pb-4">
              <Separator className="bg-border" />

              {/* Warnings */}
              {criticalWeaknesses.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-[#cc0000]/10 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#cc0000]" />
                  <div>
                    <p className="text-xs font-semibold text-[#cc0000]">주의: 공통 약점이 많습니다</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {criticalWeaknesses.map((type) => (
                        <TypeBadge key={type} type={type} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Type Coverage */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  타입 커버리지
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((type) => {
                    const isCovered = coverage.has(type);
                    return (
                      <span
                        key={type}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase transition-opacity ${
                          isCovered ? "text-white" : "opacity-20 text-white"
                        }`}
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                      >
                        {type}
                      </span>
                    );
                  })}
                </div>
                {uncoveredTypes.length > 0 && (
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    커버하지 못하는 타입: {uncoveredTypes.length}개
                  </p>
                )}
              </div>

              {/* Team Weakness Map */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  팀 약점 분포
                </h4>
                <div className="grid grid-cols-6 gap-1 sm:grid-cols-9">
                  {ALL_TYPES.map((type) => {
                    const count = weaknesses.get(type) || 0;
                    return (
                      <div key={type} className="text-center">
                        <div
                          className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold"
                          style={{
                            backgroundColor:
                              count >= 3 ? "#cc000030" : count >= 2 ? "#f5c51820" : count >= 1 ? "#2a2a4a" : "#1a1a2e",
                            color: count >= 3 ? "#cc0000" : count >= 2 ? "#f5c518" : count >= 1 ? "#a0a0b0" : "#606070",
                          }}
                        >
                          {count}
                        </div>
                        <span className="block h-1 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team Stats Overview */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  팀 평균 스탯
                </h4>
                {(() => {
                  const avg = {
                    hp: Math.round(activeTeam.reduce((s, p) => s + p.stats.hp, 0) / activeTeam.length),
                    atk: Math.round(activeTeam.reduce((s, p) => s + p.stats.attack, 0) / activeTeam.length),
                    def: Math.round(activeTeam.reduce((s, p) => s + p.stats.defense, 0) / activeTeam.length),
                    spA: Math.round(activeTeam.reduce((s, p) => s + p.stats.spAtk, 0) / activeTeam.length),
                    spD: Math.round(activeTeam.reduce((s, p) => s + p.stats.spDef, 0) / activeTeam.length),
                    spd: Math.round(activeTeam.reduce((s, p) => s + p.stats.speed, 0) / activeTeam.length),
                  };
                  return (
                    <div className="space-y-1.5">
                      <StatBar label="HP" value={avg.hp} max={255} />
                      <StatBar label="ATK" value={avg.atk} max={255} />
                      <StatBar label="DEF" value={avg.def} max={255} />
                      <StatBar label="SpA" value={avg.spA} max={255} />
                      <StatBar label="SpD" value={avg.spD} max={255} />
                      <StatBar label="SPD" value={avg.spd} max={255} />
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
