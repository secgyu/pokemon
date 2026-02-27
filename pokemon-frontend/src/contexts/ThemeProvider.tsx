import type { ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeContext } from "./themeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
