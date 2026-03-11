import { ArrowLeftRight } from "lucide-react";
import { PokemonSprite } from "@/components/common";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { HpBar } from "./HpBar";
import type { PlayerBattleState } from "@/lib/battle";

interface SwapPanelProps {
  playerState: PlayerBattleState;
  disabled: boolean;
  onSwap: (index: number) => void;
}

export function SwapPanel({ playerState, disabled, onSwap }: SwapPanelProps) {
  const aliveOthers = playerState.team
    .map((b, i) => ({ ...b, index: i }))
    .filter((b) => b.index !== playerState.activeIndex && b.currentHp > 0);

  if (aliveOthers.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <ArrowLeftRight className="h-3.5 w-3.5" />
        포켓몬 교체
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {aliveOthers.map((b) => {
          return (
            <button
              key={b.index}
              onClick={() => onSwap(b.index)}
              disabled={disabled}
              className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 text-left transition-all hover:border-ring/50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <PokemonSprite id={b.pokemon.id} alt={b.pokemon.nameKo} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{b.pokemon.nameKo}</p>
                <div className="flex gap-0.5">
                  {b.pokemon.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
                <div className="mt-1">
                  <HpBar current={b.currentHp} max={b.pokemon.stats.hp} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
