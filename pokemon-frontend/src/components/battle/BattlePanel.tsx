import { TYPE_COLORS } from "@/data/pokemon";
import type { TrainerData } from "@/data/trainers";
import { RANK_LABELS, RANK_COLORS } from "@/data/trainers";
import { PokemonSprite } from "@/components/common";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { HpBar } from "./HpBar";
import type { BattlerState } from "@/lib/battle";

interface BattlePanelProps {
  battler: BattlerState;
  isPlayer: boolean;
  trainer?: TrainerData;
  teamSize?: number;
  remaining?: number;
}

export function BattlePanel({ battler, isPlayer, trainer, teamSize, remaining }: BattlePanelProps) {
  const { pokemon, currentHp } = battler;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        {trainer && !isPlayer ? (
          <div className="mb-1">
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: RANK_COLORS[trainer.rank] }}
            >
              {RANK_LABELS[trainer.rank]}
            </span>
            <p className="mt-0.5 font-pixel text-[10px] text-muted-foreground sm:text-xs">{trainer.nameKo}</p>
          </div>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">{isPlayer ? "MY" : "ENEMY"}</span>
        )}
        <h3 className="font-pixel text-xs text-foreground sm:text-sm">{pokemon.nameKo}</h3>
        <div className="mt-1 flex justify-center gap-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute inset-0 rounded-full opacity-15 blur-2xl"
          style={{ backgroundColor: TYPE_COLORS[pokemon.types[0]] }}
        />
        <PokemonSprite
          id={pokemon.id}
          alt={pokemon.name}
          size="lg"
          className={`relative drop-shadow-lg ${
            currentHp <= 0 ? "grayscale opacity-40" : "animate-float"
          } transition-all duration-300`}
        />
      </div>

      <div className="w-full max-w-[200px]">
        <HpBar current={currentHp} max={pokemon.stats.hp} />
      </div>

      {teamSize != null && remaining != null && (
        <div className="flex gap-1">
          {Array.from({ length: teamSize }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i < remaining ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
