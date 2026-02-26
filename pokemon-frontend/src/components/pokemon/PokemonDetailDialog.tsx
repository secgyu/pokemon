import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getArtworkUrl, formatPokedexNumber } from "@/data/pokemon";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { TypeBadge } from "./TypeBadge";
import { StatBar } from "./StatBar";
import { PokeballSpinner } from "./PokeballSpinner";
import { Separator } from "@/components/ui/separator";
import { Ruler, Weight } from "lucide-react";

interface PokemonDetailDialogProps {
  pokemonId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PokemonDetailDialog({ pokemonId, open, onOpenChange }: PokemonDetailDialogProps) {
  const { detail, loading, error } = usePokemonDetail(open ? pokemonId : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-popover p-0 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <PokeballSpinner size={40} />
          </div>
        )}

        {error && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-[#cc0000]">데이터를 불러올 수 없습니다</p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
        )}

        {detail && !loading && (
          <>
            <div className="relative px-6 pt-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-pixel text-base text-foreground">{detail.nameKo}</span>
                  <span className="text-sm font-medium tabular-nums text-muted-foreground">
                    {formatPokedexNumber(detail.id)}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-2 flex gap-1.5">
                {detail.types.map((type) => (
                  <TypeBadge key={type} type={type} size="md" />
                ))}
              </div>
            </div>

            <div className="flex justify-center py-4">
              <img src={getArtworkUrl(detail.id)} alt={detail.name} className="h-48 w-48 drop-shadow-2xl" />
            </div>

            <div className="space-y-4 px-6 pb-6">
              {detail.description && (
                <p className="text-sm leading-relaxed text-secondary-custom">{detail.description}</p>
              )}

              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">키</span>
                  <span className="font-semibold">{detail.height}m</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">몸무게</span>
                  <span className="font-semibold">{detail.weight}kg</span>
                </div>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Base Stats
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "HP", value: detail.stats.hp },
                    { label: "ATK", value: detail.stats.attack },
                    { label: "DEF", value: detail.stats.defense },
                    { label: "SpA", value: detail.stats.spAtk },
                    { label: "SpD", value: detail.stats.spDef },
                    { label: "SPD", value: detail.stats.speed },
                  ].map((stat) => (
                    <StatBar key={stat.label} label={stat.label} value={stat.value} />
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="w-12 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Total
                  </span>
                  <span className="w-8 text-right text-sm font-bold tabular-nums text-primary">
                    {detail.stats.hp +
                      detail.stats.attack +
                      detail.stats.defense +
                      detail.stats.spAtk +
                      detail.stats.spDef +
                      detail.stats.speed}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
