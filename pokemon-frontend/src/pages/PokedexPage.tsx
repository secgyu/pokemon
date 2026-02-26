import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { POKEMON_DATA, ALL_TYPES, type Pokemon, type PokemonType } from "@/data/pokemon";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { PokemonDetailDialog } from "@/components/pokemon/PokemonDetailDialog";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

export function PokedexPage() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const toggleType = (type: PokemonType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = useMemo(() => {
    return POKEMON_DATA.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameKo.includes(search) ||
        String(p.id).includes(search);

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((t) => p.types.includes(t));

      return matchesSearch && matchesType;
    });
  }, [search, selectedTypes]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-lg text-foreground sm:text-xl">Pokédex</h1>
        <p className="mt-1 text-sm text-secondary-custom">
          포켓몬 도감에서 원하는 포켓몬을 찾아보세요
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="이름, 번호로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-card pl-9 pr-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`cursor-pointer transition-all duration-150 ${
                selectedTypes.includes(type)
                  ? "scale-105 ring-2 ring-white/30 rounded-full"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <TypeBadge type={type} />
            </button>
          ))}
          {selectedTypes.length > 0 && (
            <button
              onClick={() => setSelectedTypes([])}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-3 w-3" />
              초기화
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-custom">
        {filtered.length}마리의 포켓몬
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-pixel text-sm text-muted-foreground">검색 결과 없음</p>
          <p className="mt-2 text-xs text-muted-custom">다른 이름이나 타입으로 검색해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => setSelectedPokemon(pokemon)}
            />
          ))}
        </div>
      )}

      <PokemonDetailDialog
        pokemon={selectedPokemon}
        open={!!selectedPokemon}
        onOpenChange={(open) => {
          if (!open) setSelectedPokemon(null);
        }}
      />
    </div>
  );
}
