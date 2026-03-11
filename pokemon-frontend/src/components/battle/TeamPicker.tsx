import { useState, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import type { PokemonListItem } from "@/data/pokemon";
import { GENERATIONS, TYPE_COLORS } from "@/data/pokemon";
import type { TrainerData } from "@/data/trainers";
import { RANK_LABELS, RANK_COLORS } from "@/data/trainers";
import { PokemonSprite } from "@/components/common";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TeamPickerProps {
  trainer: TrainerData;
  allPokemon: PokemonListItem[];
  maxTeamSize: number;
  onConfirm: (selectedIds: number[]) => void;
  onBack: () => void;
}

export function TeamPicker({ trainer, allPokemon, maxTeamSize, onConfirm, onBack }: TeamPickerProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const genRange = GENERATIONS[trainer.generation];
  const generationPokemon = useMemo(() => {
    if (!genRange) return allPokemon;
    const [min, max] = genRange.range;
    return allPokemon.filter((p) => p.id >= min && p.id <= max);
  }, [allPokemon, genRange]);

  const filtered = useMemo(() => {
    if (!search.trim()) return generationPokemon;
    const q = search.toLowerCase();
    return generationPokemon.filter(
      (p) => p.nameKo.includes(q) || p.name.toLowerCase().includes(q) || String(p.id) === q,
    );
  }, [generationPokemon, search]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxTeamSize) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              ← 트레이너 선택
            </button>
          </div>
          <h2 className="mt-1 font-pixel text-base text-foreground sm:text-lg">포켓몬 선택</h2>
          <p className="text-xs text-muted-foreground">
            <span
              className="mr-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: RANK_COLORS[trainer.rank] }}
            >
              {RANK_LABELS[trainer.rank]}
            </span>
            {trainer.nameKo}에게 도전할 포켓몬을 선택하세요 (최대 {maxTeamSize}마리)
          </p>
        </div>
        <Button
          onClick={() => onConfirm(selected)}
          disabled={selected.length === 0}
          size="sm"
          className="gap-1 cursor-pointer"
        >
          배틀 시작 ({selected.length}/{maxTeamSize})
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-3">
          {selected.map((id) => {
            const pk = allPokemon.find((p) => p.id === id);
            if (!pk) return null;
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className="group relative cursor-pointer"
                title={`${pk.nameKo} 제거`}
              >
                <PokemonSprite
                  id={id}
                  alt={pk.nameKo}
                  size="md"
                  className="rounded-full border-2 border-primary bg-secondary/50"
                />
                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="포켓몬 이름 또는 번호로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
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

      <p className="text-xs text-muted-foreground">
        {genRange ? `${genRange.label} 포켓몬` : "전체 포켓몬"} ({filtered.length}마리)
      </p>

      <ScrollArea className="h-[400px] rounded-lg border border-border">
        <div className="grid grid-cols-2 gap-1.5 p-2 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((pk) => {
            const isSelected = selected.includes(pk.id);
            const isFull = selected.length >= maxTeamSize && !isSelected;
            return (
              <button
                key={pk.id}
                onClick={() => toggle(pk.id)}
                disabled={isFull}
                className={`group relative flex flex-col items-center gap-1 rounded-lg border p-2 transition-all cursor-pointer ${
                  isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card hover:border-ring/50"
                } ${isFull ? "cursor-not-allowed opacity-40" : ""}`}
                style={
                  isSelected
                    ? { background: `linear-gradient(135deg, ${TYPE_COLORS[pk.types[0]]}15, transparent)` }
                    : undefined
                }
              >
                {isSelected && (
                  <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <PokemonSprite id={pk.id} alt={pk.nameKo} size="sm" />
                <p className="truncate text-[10px] font-medium text-foreground">{pk.nameKo}</p>
                <div className="flex gap-0.5">
                  {pk.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
