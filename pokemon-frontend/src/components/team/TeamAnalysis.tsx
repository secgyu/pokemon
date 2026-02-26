import { Shield, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ALL_TYPES, TYPE_COLORS, type PokemonListItem, type PokemonDetail, type PokemonType } from "@/data/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { StatBar } from "@/components/pokemon/StatBar";
import { getTeamWeaknesses, getTeamCoverage } from "@/lib/team";

interface TeamAnalysisProps {
  team: PokemonListItem[];
  details: Map<number, PokemonDetail>;
  detailsLoading: boolean;
  open: boolean;
  onToggle: () => void;
}

export function TeamAnalysis({ team, details, detailsLoading, open, onToggle }: TeamAnalysisProps) {
  const weaknesses = getTeamWeaknesses(team);
  const coverage = getTeamCoverage(team, details);
  const criticalWeaknesses = [...weaknesses.entries()].filter(([, count]) => count >= 3).map(([type]) => type);
  const uncoveredTypes = ALL_TYPES.filter((t) => !coverage.has(t));

  return (
    <div className="rounded-xl border border-border bg-card">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 cursor-pointer">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">팀 분석</h3>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="space-y-4 px-4 pb-4">
          <Separator className="bg-border" />

          <WeaknessWarning weaknesses={criticalWeaknesses} />
          <CoverageGrid coverage={coverage} uncoveredCount={uncoveredTypes.length} />
          <WeaknessMap weaknesses={weaknesses} />
          <TeamStats team={team} details={details} loading={detailsLoading} />
        </div>
      )}
    </div>
  );
}

function WeaknessWarning({ weaknesses }: { weaknesses: PokemonType[] }) {
  if (weaknesses.length === 0) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg bg-[#cc0000]/10 p-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#cc0000]" />
      <div>
        <p className="text-xs font-semibold text-[#cc0000]">주의: 공통 약점이 많습니다</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {weaknesses.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CoverageGrid({ coverage, uncoveredCount }: { coverage: Set<PokemonType>; uncoveredCount: number }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">타입 커버리지</h4>
      <div className="flex flex-wrap gap-1.5">
        {ALL_TYPES.map((type) => (
          <span
            key={type}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase transition-opacity ${
              coverage.has(type) ? "text-white" : "opacity-20 text-white"
            }`}
            style={{ backgroundColor: TYPE_COLORS[type] }}
          >
            {type}
          </span>
        ))}
      </div>
      {uncoveredCount > 0 && (
        <p className="mt-2 text-[10px] text-muted-foreground">커버하지 못하는 타입: {uncoveredCount}개</p>
      )}
    </div>
  );
}

function WeaknessMap({ weaknesses }: { weaknesses: Map<PokemonType, number> }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">팀 약점 분포</h4>
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
  );
}

function TeamStats({
  team,
  details,
  loading,
}: {
  team: PokemonListItem[];
  details: Map<number, PokemonDetail>;
  loading: boolean;
}) {
  const withStats = team.map((p) => details.get(p.id)).filter(Boolean) as PokemonDetail[];

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">팀 평균 스탯</h4>
        {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>
      {withStats.length === 0 ? (
        <p className="text-xs text-muted-foreground">스탯 데이터를 불러오는 중...</p>
      ) : (
        <div className="space-y-1.5">
          {(["hp", "attack", "defense", "spAtk", "spDef", "speed"] as const).map((key) => {
            const label = { hp: "HP", attack: "ATK", defense: "DEF", spAtk: "SpA", spDef: "SpD", speed: "SPD" }[key];
            const avg = Math.round(withStats.reduce((s, p) => s + p.stats[key], 0) / withStats.length);
            return <StatBar key={key} label={label} value={avg} max={255} />;
          })}
        </div>
      )}
    </div>
  );
}
