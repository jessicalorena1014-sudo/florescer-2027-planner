import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Droplets, Flame, Smile, Target, Quote, Trophy, NotebookPen,
  BookOpen, Wallet, HeartPulse, TrendingUp, Plus, Minus, ChevronRight,
  CalendarDays, Check,
} from "lucide-react";
import { Card } from "@/components/AppShell";
import { useLocalState } from "@/lib/storage";
import { useAgenda, eventsOn, isDone, toggleDone, ymd, fromYmd } from "@/lib/agenda";
import { JardimFlorescer } from "@/components/JardimFlorescer";
import { ContextualTip } from "@/components/ContextualTip";

export const Route = createFileRoute("/")({
  component: Home,
});

const phrases = [
  "Floresça no seu próprio tempo.",
  "Pequenos passos, grandes colheitas.",
  "Hoje é uma página em branco — escreva com gentileza.",
  "Você está exatamente onde precisa estar.",
  "Cultive a paz antes da pressa.",
];

const moods = ["😊", "🌷", "😌", "✨", "🌙", "🥰"];

function greeting(h: number) {
  if (h < 5) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function Home() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  });
  const phrase = phrases[today.getDate() % phrases.length];

  const [water, setWater] = useLocalState<number>("home:water", 0);
  const [mood, setMood] = useLocalState<string>("home:mood", "🌷");
  const [streak] = useLocalState<number>("habits:streak", 12);
  const [mainGoal] = useLocalState<string>("home:mainGoal", "Florescer com intenção em 2027");
  const [events, setEvents] = useAgenda();
  const todayEvents = eventsOn(events, today);
  const todayKey = ymd(today);
  const upcoming = events
    .filter((e) => e.date > todayKey && e.recurrence === "none")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const monthProgress = Math.round(
    ((today.getDate() / new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) * 100)
  );

  return (
    <div className="space-y-6">
      <ContextualTip tipKey="home" title="Dica gentil">
        Tudo é salvo no seu aparelho automaticamente. Visite <strong>Como usar</strong> no menu para um passeio completo.
      </ContextualTip>
      {/* Hero */}
      <div className="rounded-[2rem] gradient-cream border border-border shadow-petal p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-[var(--gold)]/15 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-[var(--rose)]/15 blur-3xl" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            {dateStr}
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] mt-3 max-w-2xl">
            {greeting(today.getHours())}, <span className="italic text-[var(--gold)]">florescente</span>.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground flex items-start gap-2">
            <Quote className="h-4 w-4 mt-1 shrink-0" />
            <span className="italic">{phrase}</span>
          </p>
        </div>
      </div>

      {/* Hoje + Jardim */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> Prioridades de hoje
            </div>
            <Link to="/agenda" className="text-xs text-[var(--gold)] hover:underline">Ver agenda →</Link>
          </div>
          {todayEvents.length === 0 ? (
            <div className="text-sm italic text-muted-foreground py-6 text-center">
              Nada agendado — comece pela <Link to="/agenda" className="underline">Agenda</Link>.
            </div>
          ) : (
            <div className="space-y-1.5">
              {todayEvents.slice(0, 6).map((ev) => {
                const done = isDone(ev, today);
                return (
                  <button
                    key={ev.id}
                    onClick={() => setEvents(events.map((e) => e.id === ev.id ? toggleDone(e, today) : e))}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary/60 text-left transition"
                  >
                    <span className={`h-5 w-5 rounded-md border flex items-center justify-center ${done ? "bg-[var(--gold)] border-[var(--gold)] text-primary-foreground" : "border-border bg-card"}`}>
                      {done && <Check className="h-3 w-3" />}
                    </span>
                    <span className={`flex-1 text-sm ${done ? "line-through text-muted-foreground" : ""}`}>
                      {ev.time && <span className="text-muted-foreground mr-2">{ev.time}</span>}{ev.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {upcoming.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border">
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Próximos</div>
              <div className="space-y-1">
                {upcoming.map((e) => (
                  <Link key={e.id} to="/agenda" className="flex items-center gap-3 text-sm rounded-xl px-2 py-1.5 hover:bg-secondary/60">
                    <span className="text-xs text-muted-foreground w-20 shrink-0">
                      {fromYmd(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </span>
                    <span className="truncate">{e.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>

        <JardimFlorescer />
      </div>


      {/* Widgets grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <Widget icon={Target} label="Meta principal" big="2027" sub={mainGoal} span="col-span-2 lg:col-span-3" tone="gold" />
        <Widget icon={Flame} label="Sequência" big={`${streak}`} sub="dias seguidos" tone="rose" />
        <Widget icon={TrendingUp} label="Progresso do mês" big={`${monthProgress}%`} sub="completos" tone="sage" />

        {/* Water */}
        <Card className="col-span-2">
          <WidgetHeader icon={Droplets} label="Água" />
          <div className="mt-3 flex items-center justify-between">
            <div className="font-serif text-4xl">{water}<span className="text-base text-muted-foreground">/8</span></div>
            <div className="flex items-center gap-1">
              <IconBtn onClick={() => setWater(Math.max(0, water - 1))}><Minus className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn onClick={() => setWater(Math.min(8, water + 1))}><Plus className="h-3.5 w-3.5" /></IconBtn>
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < water ? "bg-[var(--gold)]" : "bg-muted"}`} />
            ))}
          </div>
        </Card>

        {/* Mood */}
        <Card className="col-span-2">
          <WidgetHeader icon={Smile} label="Humor de hoje" />
          <div className="mt-3 flex items-center justify-between gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`h-10 w-10 rounded-2xl text-xl transition-all ${
                  mood === m ? "bg-secondary scale-110 shadow-soft" : "hover:bg-secondary/60"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </Card>

        <Widget icon={Trophy} label="Conquistas" big="07" sub="este mês" tone="gold" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QuickLink to="/diario" icon={NotebookPen} title="Continuar diário" desc="Você escreveu há 2 dias." />
        <QuickLink to="/estudos" icon={BookOpen} title="Próxima tarefa" desc="Revisar resumo de leitura." />
        <QuickLink to="/financeiro" icon={Wallet} title="Resumo financeiro" desc="Veja entradas e saídas do mês." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <WidgetHeader icon={HeartPulse} label="Energia emocional" />
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <div className="font-serif text-3xl">Serena</div>
              <div className="text-xs text-muted-foreground">7 / 10</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[70%] gradient-gold rounded-full" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Respire fundo. Reserve 10 minutos para você hoje.
            </p>
          </div>
        </Card>

        <Card>
          <WidgetHeader icon={TrendingUp} label="Progresso do ano" />
          <div className="mt-4 grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }).map((_, i) => {
              const done = i < today.getMonth();
              const current = i === today.getMonth();
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium
                    ${done ? "bg-primary text-primary-foreground" :
                      current ? "bg-[var(--gold)]/30 text-foreground border border-[var(--gold)]" :
                      "bg-muted text-muted-foreground"}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Mês {today.getMonth() + 1} de 12 — continue florescendo.
          </p>
        </Card>
      </div>
    </div>
  );
}

function WidgetHeader({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

function Widget({
  icon: Icon, label, big, sub, span = "", tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; big: string; sub: string; span?: string;
  tone?: "default" | "gold" | "rose" | "sage";
}) {
  const toneClass =
    tone === "gold" ? "bg-[var(--gold)]/12 border-[var(--gold)]/30" :
    tone === "rose" ? "bg-[var(--rose)]/15 border-[var(--rose)]/30" :
    tone === "sage" ? "bg-[var(--sage)]/15 border-[var(--sage)]/30" :
    "bg-card border-border";

  return (
    <div className={`rounded-3xl border shadow-soft p-5 ${toneClass} ${span}`}>
      <WidgetHeader icon={Icon} label={label} />
      <div className="font-serif text-3xl sm:text-4xl mt-2 leading-none">{big}</div>
      <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{sub}</div>
    </div>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 rounded-full bg-secondary hover:bg-[var(--gold)]/30 flex items-center justify-center transition"
    >
      {children}
    </button>
  );
}

function QuickLink({
  to, icon: Icon, title, desc,
}: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <Link to={to} className="group">
      <Card className="hover:shadow-petal transition-all hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-[var(--gold)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-xl leading-tight">{title}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{desc}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition" />
        </div>
      </Card>
    </Link>
  );
}
