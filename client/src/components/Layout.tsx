import React from "react";
import { Link, useLocation } from "wouter";
import { Compass, Home, User, Menu } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isPlayer = location.includes("/play");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] bg-background sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border border-white/10">
        <main className="flex-1 overflow-y-auto scrollbar-hide relative">
          {children}
        </main>

        {!isPlayer && (
          <nav className="h-16 glass-panel border-t border-white/5 flex items-center justify-around px-6 absolute bottom-0 w-full z-50">
            <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{t("nav.home")}</span>
            </Link>
            <Link href="/explore" className={`flex flex-col items-center gap-1 transition-colors ${location === '/explore' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>
                <Compass className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{t("nav.explore")}</span>
            </Link>
            <Link href="/profile" className={`flex flex-col items-center gap-1 transition-colors ${location === '/profile' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>
                <User className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{t("nav.profile")}</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
