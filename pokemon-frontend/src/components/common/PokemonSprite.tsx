import { getSpriteUrl } from "@/data/pokemon";

interface PokemonSpriteProps {
  id: number;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-28 w-28 sm:h-36 sm:w-36",
  xl: "h-40 w-40 sm:h-52 sm:w-52",
};

export function PokemonSprite({ id, alt, size = "md", className = "", style }: PokemonSpriteProps) {
  return (
    <img
      src={getSpriteUrl(id)}
      alt={alt ?? `Pokemon #${id}`}
      className={`sprite-pixel ${SIZE_MAP[size]} ${className}`}
      style={style}
      loading="lazy"
    />
  );
}
