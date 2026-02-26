import { useState } from "react";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPokedexNumber, type PokemonListItem } from "@/data/pokemon";
import { PokemonSprite, SearchInput } from "@/components/common";

interface PokemonPickerProps {
  slot: number;
  allPokemon: PokemonListItem[];
  team: (PokemonListItem | null)[];
  onSelect: (pokemon: PokemonListItem) => void;
  onClose: () => void;
}

export function PokemonPicker({ slot, allPokemon, team, onSelect, onClose }: PokemonPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = allPokemon.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.nameKo.includes(q) || p.name.toLowerCase().includes(q) || String(p.id) === q;
  });

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">슬롯 {slot + 1}에 추가할 포켓몬 선택</h3>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="border-b border-border px-4 py-2">
        <SearchInput value={search} onChange={setSearch} placeholder="이름, 번호로 검색..." />
      </div>
      <ScrollArea className="h-[280px]">
        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.slice(0, 120).map((pokemon) => {
            const alreadyInTeam = team.some((t) => t?.id === pokemon.id);
            return (
              <button
                key={pokemon.id}
                onClick={() => !alreadyInTeam && onSelect(pokemon)}
                disabled={alreadyInTeam}
                className={`flex items-center gap-2 rounded-lg border border-border p-2 transition-all cursor-pointer ${
                  alreadyInTeam ? "cursor-not-allowed opacity-30" : "hover:border-ring/50 hover:bg-popover"
                }`}
              >
                <PokemonSprite id={pokemon.id} alt={pokemon.name} size="sm" />
                <div className="text-left min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{pokemon.nameKo}</p>
                  <p className="text-[10px] text-muted-foreground">{formatPokedexNumber(pokemon.id)}</p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
