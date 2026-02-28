import { Heart } from "lucide-react";
import { type PokemonListItem, getSpriteUrl, formatPokedexNumber, TYPE_COLORS } from "@/data/pokemon";
import { TypeBadge } from "./TypeBadge";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export function PokemonCard({ pokemon, onClick, isFavorite, onToggleFavorite }: PokemonCardProps) {
  const primaryColor = TYPE_COLORS[pokemon.types[0]];

  return (
    <div className="group relative">
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pokemon.id);
          }}
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          className="absolute left-2 top-2 z-10 rounded-full p-1 transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"}`}
          />
        </button>
      )}
      <button
        onClick={onClick}
        aria-label={`${pokemon.nameKo} (${formatPokedexNumber(pokemon.id)}) 상세 보기`}
        className="flex w-full flex-col items-center rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        style={{ boxShadow: "none" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 16px ${primaryColor}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span className="absolute right-3 top-3 text-xs font-semibold tabular-nums text-muted-foreground">
          {formatPokedexNumber(pokemon.id)}
        </span>
        <div className="relative mb-2 flex h-24 w-24 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-25"
            style={{ backgroundColor: primaryColor }}
          />
          <img
            src={getSpriteUrl(pokemon.id)}
            alt={pokemon.name}
            className="relative h-20 w-20 sprite-pixel drop-shadow-lg"
            loading="lazy"
          />
        </div>
        <h3 className="text-sm font-bold text-foreground">{pokemon.nameKo}</h3>
        <p className="mb-2 text-[11px] text-muted-foreground">{pokemon.name}</p>
        <div className="flex gap-1.5">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </button>
    </div>
  );
}
