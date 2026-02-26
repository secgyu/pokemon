import { type PokemonType, TYPE_COLORS } from "@/data/pokemon";

interface TypeBadgeProps {
  type: PokemonType;
  size?: "sm" | "md";
}

export function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const color = TYPE_COLORS[type];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold uppercase text-white ${
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
      style={{ backgroundColor: color }}
    >
      {type}
    </span>
  );
}
