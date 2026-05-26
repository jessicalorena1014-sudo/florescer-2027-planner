import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home, Calendar, CalendarDays, Target, Sprout, Wallet, Heart,
  BookOpen, ListChecks, Notebook, Brain, Sparkles, Moon, Sun, Menu, X,
} from "lucide-react";
import { useTheme } from "@/lib/storage";
import { useAgenda } from "@/lib/agenda";
import { useNotifSettings, useScheduleNotifications } from "@/lib/notifications";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/visao-anual", label: "Visão Anual", icon: Calendar },
  { to: "/meses", label: "Meses", icon: CalendarDays },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/habitos", label: "Hábitos", icon: Sprout },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/saude", label: "Saúde", icon: Heart },
  { to: "/estudos", label: "Estudos", icon: BookOpen },
  { to: "/rotina", label: "Rotina", icon: ListChecks },
  { to: "/diario", label: "Diário", icon: Notebook },
  { to: "/brain-dump", label: "Brain Dump", icon: Brain },
  { to: "/reflexoes", label: "Reflexões", icon: Sparkles },
] as const;

const bottomNav = [
  { to: "/", label: "Hoje", icon: Home },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/habitos", label: "Hábitos", icon: Sprout },
  { to: "/reflexoes", label: "Reflexões", icon: Sparkles },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [events] = useAgenda();
  const [notifSettings] = useNotifSettings();
  useScheduleNotifications(events, notifSettings);

  return (
    <div className="min-h-screen flex w-full bg-background bg-noise overflow-x-hidden">
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-card px-3 py-2 rounded-xl shadow-soft text-sm">
        Pular para o conteúdo
      </a>
      {/* Sidebar — desktop / tablet */}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col border-r border-border bg-sidebar/80 backdrop-blur sticky top-0 h-screen">
        <BrandHeader />
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm transition-all
                  ${active
                    ? "bg-card text-foreground shadow-soft"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-foreground"}`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-[var(--gold)]" : ""}`} strokeWidth={1.5} />
                <span className="font-medium tracking-wide">{label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={toggle}
          className="m-3 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          {theme === "light" ? "Modo noite" : "Modo dia"}
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-background/85 backdrop-blur border-b border-border safe-area-pt">
        <Link to="/" className="font-serif text-lg tracking-tight active:scale-[0.98] transition-transform">
          Florescer <span className="text-[var(--gold)]">2027</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            aria-label={theme === "light" ? "Ativar modo noite" : "Ativar modo dia"}
            className="h-11 w-11 grid place-items-center rounded-full hover:bg-secondary active:bg-secondary active:scale-95 transition"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="h-11 w-11 grid place-items-center rounded-full hover:bg-secondary active:bg-secondary active:scale-95 transition"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 bg-sidebar shadow-petal flex flex-col animate-bloom">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <BrandHeader compact />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="h-11 w-11 grid place-items-center rounded-full hover:bg-secondary active:scale-95 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Menu" className="flex-1 overflow-y-auto p-3 space-y-1">
              {nav.map(({ to, label, icon: Icon }) => {
                const active = to === "/" ? path === "/" : path.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] active:scale-[0.99] transition
                      ${active ? "bg-card text-foreground shadow-soft" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"}`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-[var(--gold)]" : ""}`} strokeWidth={1.5} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <main id="main-content" className="flex-1 min-w-0 pt-[calc(env(safe-area-inset-top)+3.75rem)] md:pt-0 pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 animate-bloom">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Navegação principal"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/90 backdrop-blur border-t border-border"
      >
        <div className="grid grid-cols-5 gap-1 px-2 pt-1.5 safe-area-pb">
          {bottomNav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className="relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-2xl transition-all active:scale-95"
              >
                <span
                  className={`grid place-items-center h-9 w-12 rounded-2xl transition-all ${
                    active
                      ? "bg-secondary text-foreground shadow-soft"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span
                  className={`text-[10px] font-medium leading-none ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`px-5 ${compact ? "" : "pt-7 pb-5"}`}>
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Planner</div>
      <div className="font-serif text-2xl leading-tight mt-1">
        Florescer
        <span className="text-[var(--gold)]"> 2027</span>
      </div>
      {!compact && (
        <div className="text-xs text-muted-foreground mt-1 italic">Floresça com intenção.</div>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow, title, subtitle, icon: Icon,
}: { eyebrow?: string; title: string; subtitle?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <header className="mb-8 sm:mb-10">
      {eyebrow && <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground mb-2">{eyebrow}</div>}
      <div className="flex items-end gap-3">
        {Icon && (
          <div className="h-11 w-11 rounded-2xl bg-card border border-border shadow-soft flex items-center justify-center">
            <Icon className="h-5 w-5 text-[var(--gold)]" />
          </div>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl leading-none">{title}</h1>
      </div>
      {subtitle && <p className="mt-3 text-muted-foreground max-w-xl">{subtitle}</p>}
    </header>
  );
}

export function Card({
  className = "", children,
}: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
