import { useState } from "react";
import { Crown, Shield, Star } from "lucide-react";
import { TYPE_COLORS } from "@/data/pokemon";
import { PokemonSprite } from "@/components/common";
import { type TrainerData, type TrainerRank, RANK_LABELS, RANK_COLORS, GENERATIONS_TRAINERS } from "@/data/trainers";

interface TrainerSelectProps {
  onSelect: (trainer: TrainerData) => void;
}

const RANK_ICONS: Record<TrainerRank, typeof Shield> = {
  gym: Shield,
  elite4: Star,
  champion: Crown,
};

function TrainerCard({ trainer, onClick }: { trainer: TrainerData; onClick: () => void }) {
  const Icon = RANK_ICONS[trainer.rank];
  const accentColor = TYPE_COLORS[trainer.specialty];

  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all duration-200 hover:border-ring/50 hover:shadow-lg active:scale-[0.98] cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${accentColor}10, transparent 60%)`,
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-pixel text-xs text-foreground sm:text-sm">{trainer.nameKo}</p>
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
            style={{ backgroundColor: RANK_COLORS[trainer.rank] }}
          >
            {RANK_LABELS[trainer.rank]}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{trainer.title}</p>
      </div>

      <div className="flex shrink-0 -space-x-2">
        {trainer.pokemonIds.slice(0, 3).map((id, i) => (
          <PokemonSprite
            key={`${id}-${i}`}
            id={id}
            size="sm"
            className="rounded-full border-2 border-card bg-secondary/50 transition-transform group-hover:translate-y-[-2px]"
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
        {trainer.pokemonIds.length > 3 && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-bold text-muted-foreground">
            +{trainer.pokemonIds.length - 3}
          </div>
        )}
      </div>
    </button>
  );
}

export function TrainerSelect({ onSelect }: TrainerSelectProps) {
  const [selectedGen, setSelectedGen] = useState(1);
  const genData = GENERATIONS_TRAINERS.find((g) => g.generation === selectedGen)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5">
        {GENERATIONS_TRAINERS.map((g) => (
          <button
            key={g.generation}
            onClick={() => setSelectedGen(g.generation)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              selectedGen === g.generation
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            }`}
          >
            {g.generation}세대
          </button>
        ))}
      </div>

      <p className="text-sm font-medium text-muted-foreground">{genData.label}</p>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#7AC74C]" />
          <h2 className="font-pixel text-sm text-foreground">체육관 관장</h2>
          <span className="text-xs text-muted-foreground">({genData.gym.length}명)</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {genData.gym.map((t) => (
            <TrainerCard key={t.id} trainer={t} onClick={() => onSelect(t)} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-[#6F35FC]" />
          <h2 className="font-pixel text-sm text-foreground">사천왕</h2>
          <span className="text-xs text-muted-foreground">({genData.elite4.length}명)</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {genData.elite4.map((t) => (
            <TrainerCard key={t.id} trainer={t} onClick={() => onSelect(t)} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Crown className="h-4 w-4 text-[#F7D02C]" />
          <h2 className="font-pixel text-sm text-foreground">챔피언</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <TrainerCard trainer={genData.champion} onClick={() => onSelect(genData.champion)} />
        </div>
      </section>
    </div>
  );
}
