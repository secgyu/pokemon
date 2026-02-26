import { Plus, X } from "lucide-react";
import { TYPE_COLORS, type PokemonListItem } from "@/data/pokemon";
import { PokemonSprite } from "@/components/common";

interface TeamSlotsProps {
  team: (PokemonListItem | null)[];
  onAdd: (slot: number) => void;
  onRemove: (slot: number) => void;
}

export function TeamSlots({ team, onAdd, onRemove }: TeamSlotsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {team.map((pokemon, i) =>
        pokemon ? (
          <div
            key={i}
            className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-3 transition-all hover:border-[#4a4a8a]"
          >
            <button
              onClick={() => onRemove(i)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#cc0000] text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
            <PokemonSprite id={pokemon.id} alt={pokemon.name} size="md" />
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
            onClick={() => onAdd(i)}
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
  );
}
