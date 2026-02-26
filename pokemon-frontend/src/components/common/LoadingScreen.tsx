import { PokeballSpinner } from "@/components/pokemon/PokeballSpinner";

interface LoadingScreenProps {
  message?: string;
  size?: number;
}

export function LoadingScreen({ message = "로딩중...", size = 56 }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <PokeballSpinner size={size} />
      <p className="mt-4 font-pixel text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
