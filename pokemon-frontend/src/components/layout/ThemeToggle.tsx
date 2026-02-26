import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "@/hooks/useThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-accent cursor-pointer"
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-primary" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground transition-transform group-hover:-rotate-12 group-hover:text-primary" />
      )}
    </button>
  );
}
