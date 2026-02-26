import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Pokemon, getArtworkUrl, formatPokedexNumber } from "@/data/pokemon";
import { TypeBadge } from "./TypeBadge";
import { StatBar } from "./StatBar";
import { Separator } from "@/components/ui/separator";
import { Ruler, Weight } from "lucide-react";

interface PokemonDetailDialogProps {
  pokemon: Pokemon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PokemonDetailDialog({ pokemon, open, onOpenChange }: PokemonDetailDialogProps) {
  if (!pokemon) return null;

  const statEntries: { label: string; value: number }[] = [
    { label: "HP", value: pokemon.stats.hp },
    { label: "ATK", value: pokemon.stats.attack },
    { label: "DEF", value: pokemon.stats.defense },
    { label: "SpA", value: pokemon.stats.spAtk },
    { label: "SpD", value: pokemon.stats.spDef },
    { label: "SPD", value: pokemon.stats.speed },
  ];

  const total = statEntries.reduce((sum, s) => sum + s.value, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-[#12121a] p-0 overflow-hidden">
        <div className="relative px-6 pt-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-pixel text-base text-foreground">
                {pokemon.nameKo}
              </span>
              <span className="text-sm font-medium tabular-nums text-muted-foreground">
                {formatPokedexNumber(pokemon.id)}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 flex gap-1.5">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} size="md" />
            ))}
          </div>
        </div>

        <div className="flex justify-center py-4">
          <img
            src={getArtworkUrl(pokemon.id)}
            alt={pokemon.name}
            className="h-48 w-48 drop-shadow-2xl"
          />
        </div>

        <div className="space-y-4 px-6 pb-6">
          <p className="text-sm leading-relaxed text-secondary-custom">
            {pokemon.description}
          </p>

          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">키</span>
              <span className="font-semibold">{pokemon.height}m</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">몸무게</span>
              <span className="font-semibold">{pokemon.weight}kg</span>
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Base Stats
            </h4>
            <div className="space-y-2">
              {statEntries.map((stat) => (
                <StatBar key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="w-12 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total
              </span>
              <span className="w-8 text-right text-sm font-bold tabular-nums text-primary">
                {total}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
