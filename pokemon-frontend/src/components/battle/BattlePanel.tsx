import { TYPE_COLORS } from "@/data/pokemon";
import { PokemonSprite } from "@/components/common";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { HpBar } from "./HpBar";
import type { BattlerState } from "@/lib/battle";

interface BattlePanelProps {
  battler: BattlerState;
  isPlayer: boolean;
}

export function BattlePanel({ battler, isPlayer }: BattlePanelProps) {
  const { pokemon, currentHp } = battler;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-center">
        <span className="text-xs font-medium text-muted-foreground">{isPlayer ? "MY" : "ENEMY"}</span>
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
    </div>
  );
}
