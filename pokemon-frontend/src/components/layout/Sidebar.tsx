import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/constants";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-border bg-[#12121a]">
      <div className="flex items-center gap-3 px-5 py-6">
        <svg width="28" height="28" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#cc0000" stroke="#2a2a4a" strokeWidth="4" />
          <rect x="2" y="46" width="96" height="8" fill="#2a2a4a" />
          <circle cx="50" cy="50" r="48" fill="url(#sidebarHalf)" stroke="#2a2a4a" strokeWidth="4" />
          <defs>
            <linearGradient id="sidebarHalf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cc0000" />
              <stop offset="46%" stopColor="#cc0000" />
              <stop offset="46%" stopColor="#2a2a4a" />
              <stop offset="54%" stopColor="#2a2a4a" />
              <stop offset="54%" stopColor="#f0f0f0" />
              <stop offset="100%" stopColor="#f0f0f0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="12" fill="#f0f0f0" stroke="#2a2a4a" strokeWidth="4" />
          <circle cx="50" cy="50" r="6" fill="#2a2a4a" />
        </svg>
        <span className="font-pixel text-[11px] leading-tight text-primary">POKéMON</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-l-[3px] border-primary bg-[#1a1a2e] text-foreground"
                  : "border-l-[3px] border-transparent text-muted-foreground hover:bg-[#1a1a2e] hover:text-foreground"
              }`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-5 py-4">
        <p className="text-[10px] text-muted-custom">Pokémon All-in-One v1.0</p>
      </div>
    </aside>
  );
}
