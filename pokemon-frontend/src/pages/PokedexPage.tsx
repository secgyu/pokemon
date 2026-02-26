import { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_TYPES, GENERATIONS, type PokemonType } from "@/data/pokemon";
import { usePokemonList } from "@/hooks/usePokemonList";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { PokemonDetailDialog } from "@/components/pokemon/PokemonDetailDialog";
import { ErrorScreen, SearchInput, SkeletonCard } from "@/components/common";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

const PAGE_SIZE = 60;

export function PokedexPage() {
  const { pokemon, loading, error } = usePokemonList();
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [selectedGen, setSelectedGen] = useState(0);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const toggleType = (type: PokemonType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const filtered = useMemo(() => {
    const [genMin, genMax] = GENERATIONS[selectedGen].range;
    return pokemon.filter((p) => {
      const matchesGen = p.id >= genMin && p.id <= genMax;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameKo.includes(search) ||
        String(p.id).includes(search);
      const matchesType = selectedTypes.length === 0 || selectedTypes.some((t) => p.types.includes(t));
      return matchesGen && matchesSearch && matchesType;
    });
  }, [pokemon, search, selectedTypes, selectedGen]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleGenChange = (index: number) => {
    setSelectedGen(index);
    setVisibleCount(PAGE_SIZE);
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <div className="h-6 w-32 rounded skeleton-shimmer" />
          <div className="mt-2 h-4 w-48 rounded skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 20 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-pixel text-lg text-foreground sm:text-xl">Pokédex</h1>
        <p className="mt-1 text-sm text-secondary-custom">총 {pokemon.length}마리의 포켓몬 도감</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {GENERATIONS.map((gen, i) => (
          <button
            key={gen.label}
            onClick={() => handleGenChange(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              selectedGen === i
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {gen.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <SearchInput value={search} onChange={handleSearch} placeholder="이름, 번호로 검색..." />
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => {
                toggleType(type);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`cursor-pointer transition-all duration-150 ${
                selectedTypes.includes(type)
                  ? "scale-105 ring-2 ring-foreground/30 rounded-full"
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
        {visibleCount < filtered.length && ` (${visible.length}마리 표시중)`}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-pixel text-sm text-muted-foreground">검색 결과 없음</p>
          <p className="mt-2 text-xs text-muted-custom">다른 이름이나 타입으로 검색해보세요</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((p, i) => (
              <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                <PokemonCard pokemon={p} onClick={() => setSelectedPokemonId(p.id)} />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2 pb-4">
              <Button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                variant="outline"
                className="gap-2 border-border text-foreground hover:bg-secondary cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />더 보기 ({filtered.length - visibleCount}마리 남음)
              </Button>
            </div>
          )}
        </>
      )}

      <PokemonDetailDialog
        pokemonId={selectedPokemonId}
        open={selectedPokemonId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPokemonId(null);
        }}
      />
    </div>
  );
}
