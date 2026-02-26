import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:font-semibold"
      >
        본문으로 건너뛰기
      </a>
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main id="main-content" className="pb-16 md:pb-0 md:pl-[220px]">
        <div className="animate-fade-in mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
