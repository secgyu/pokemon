import { BookOpen, Swords, HelpCircle, Users } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/", icon: BookOpen, label: "Pokédex" },
  { to: "/battle", icon: Swords, label: "Battle" },
  { to: "/quiz", icon: HelpCircle, label: "Quiz" },
  { to: "/team", icon: Users, label: "Team" },
] as const;
