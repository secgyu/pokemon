import { TYPE_COLORS, type PokemonMove } from "@/data/pokemon";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

interface MoveGridProps {
  moves: PokemonMove[];
  disabled: boolean;
  onSelect: (move: PokemonMove) => void;
}

export function MoveGrid({ moves, disabled, onSelect }: MoveGridProps) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-xs font-medium text-muted-foreground">기술 선택</p>
      <div className="grid grid-cols-2 gap-2">
        {moves.map((move) => (
          <button
            key={move.name}
            onClick={() => onSelect(move)}
            disabled={disabled}
            aria-label={`${move.name} 사용 (${move.type} 타입, 위력 ${move.power || 0})`}
            className="group flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left transition-all duration-150 hover:border-ring/50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${TYPE_COLORS[move.type]}15, transparent)`,
            }}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{move.name}</p>
              <TypeBadge type={move.type} />
            </div>
            <div className="text-right text-[10px] text-muted-foreground">
              <p>PWR {move.power || "—"}</p>
              <p>ACC {move.accuracy}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
