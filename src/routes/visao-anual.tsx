import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Target, Sparkles, Smile, Flame, Flower2 } from "lucide-react";
import { PageHeader, Card, CheckList } from "@/components/Primitives";
import { JardimFlorescer } from "@/components/JardimFlorescer";
import { useLocalState } from "@/lib/storage";
import { useAgenda, occursOn, isDone, ymd } from "@/lib/agenda";

export const Route = createFileRoute("/visao-anual")({ component: VisaoAnual });

const months = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const monthShort = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];

const habitKeys = ["agua","exercicios","sono","leitura","humor","autocuidado"];
const metaCats = ["dev","saude","carreira","financas","relacionamentos","experiencias"];

type StageKey = "Semente" | "Crescendo" | "Florescendo" | "Colhendo";
function stageOf(pct: number): { name: StageKey; emoji: string; tone: string } {
  if (pct < 25) return { name: "Semente", emoji: "🌱", tone: "bg-[var(--sage)]/25 text-foreground" };
  if (pct < 55) return { name: "Crescendo", emoji: "🌿", tone: "bg-[var(--sage)]/40 text-foreground" };
  if (pct < 85) return { name: "Florescendo", emoji: "🌸", tone: "bg-[var(--rose)]/40 text-foreground" };
  return { name: "Colhendo", emoji: "💐", tone: "bg-[var(--gold)]/40 text-foreground" };
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem("florescer-2027:" + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function VisaoAnual() {
  const [foco, setFoco] = useLocalState<string>("visao:foco", "");
  const [events] = useAgenda();
  const [mood] = useLocalState<string>("home:mood", "🌷");
  const [mainGoal] = useLocalState<string>("home:mainGoal", "Florescer com intenção em 2027");
  const today = new Date();
  const year = 2027;

  const todayStr = today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-6 relative">
      {/* Floral background details */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-[var(--rose)]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-[var(--gold)]/12 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full bg-[var(--sage)]/15 blur-3xl" />
        <div className="absolute top-10 right-12 text-4xl opacity-20 select-none">🌸</div>
        <div className="absolute bottom-32 left-8 text-3xl opacity-15 select-none">🌿</div>
      </div>

      <PageHeader
        eyebrow="2027"
        title="Visão Anual"
        subtitle="Veja o ano inteiro de uma só vez e plante sua intenção."
        icon={Calendar}
      />

      {/* Resumo superior */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-[var(--gold)]/12 to-card">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> Hoje
          </div>
          <div className="font-serif text-2xl sm:text-3xl mt-2 capitalize leading-tight">{todayStr}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[var(--rose)]/15 to-card">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Smile className="h-3.5 w-3.5" /> Humor
          </div>
          <div className="font-serif text-4xl mt-2 leading-none">{mood}</div>
          <div className="text-xs text-muted-foreground mt-1">como você se sente</div>
        </Card>
        <Card className="bg-gradient-to-br from-[var(--sage)]/18 to-card">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Flame className="h-3.5 w-3.5" /> Prioridade atual
          </div>
          <div className="font-serif text-lg sm:text-xl mt-2 leading-snug italic">{mainGoal}</div>
        </Card>
      </div>

      {/* Foco do ano */}
      <Card className="bg-gradient-to-br from-[var(--gold)]/10 via-card to-[var(--rose)]/10 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 text-7xl opacity-10 select-none">🌷</div>
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Foco do ano
          </div>
          <p className="mt-3 font-serif italic text-base sm:text-lg text-muted-foreground">
            Qual é a essência que quero viver em 2027?
          </p>
          <textarea
            value={foco}
            onChange={(e) => setFoco(e.target.value)}
            placeholder="Escreva livremente a essência que deseja cultivar..."
            rows={5}
            className="mt-4 w-full bg-card/60 border border-border/60 rounded-2xl p-4 sm:p-5 font-serif text-xl sm:text-2xl leading-relaxed italic text-foreground placeholder:text-muted-foreground/50 resize-none outline-none focus:border-[var(--gold)] focus:bg-card transition min-h-[140px] sm:min-h-[180px]"
          />
        </div>
      </Card>

      {/* Mini-dashboards mensais */}
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 px-1">
          12 meses de florescer
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {months.map((m, i) => (
            <MonthMiniDashboard
              key={m}
              year={year}
              monthIdx={i}
              label={m}
              short={monthShort[i]}
              events={events}
              isCurrent={today.getFullYear() === year && today.getMonth() === i}
              currentMood={mood}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Target className="h-3.5 w-3.5" /> Metas do ano
          </div>
          <CheckList storageKey="visao:metas" placeholder="Adicione uma meta para 2027..." />
        </Card>
        <JardimFlorescer />
      </div>
    </div>
  );
}

function MonthMiniDashboard({
  year, monthIdx, label, short, events, isCurrent, currentMood,
}: {
  year: number;
  monthIdx: number;
  label: string;
  short: string;
  events: ReturnType<typeof useAgenda>[0];
  isCurrent: boolean;
  currentMood: string;
}) {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  // Tarefas no mês (todas as ocorrências)
  let totalTasks = 0;
  let doneTasks = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, monthIdx, d);
    for (const ev of events) {
      if (occursOn(ev, date)) {
        totalTasks++;
        if (isDone(ev, date)) doneTasks++;
      }
    }
  }

  // Progresso hábitos no mês
  let habitDone = 0;
  const habitTotal = habitKeys.length * daysInMonth;
  for (const k of habitKeys) {
    const map = readJSON<Record<string, boolean>>(`habit:${k}`, {});
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (map[key]) habitDone++;
    }
  }
  const habitsPct = habitTotal ? Math.round((habitDone / habitTotal) * 100) : 0;

  // Metas do mês concluídas (categoria "mes")
  let metasTotal = 0;
  let metasDone = 0;
  for (const c of metaCats) {
    const items = readJSON<Array<{ done: boolean }>>(`metas:mes:${c}`, []);
    metasTotal += items.length;
    metasDone += items.filter((i) => i.done).length;
  }

  // Humor predominante (apenas mês atual sabemos)
  const moodLabel = isCurrent ? currentMood : "—";

  // Progresso geral para estado do mês
  const taskPct = totalTasks ? (doneTasks / totalTasks) * 100 : 0;
  const metasPct = metasTotal ? (metasDone / metasTotal) * 100 : 0;
  const weights = [taskPct, habitsPct, metasPct];
  const overall = Math.round(weights.reduce((a, b) => a + b, 0) / 3);
  const stage = stageOf(overall);

  return (
    <Link
      to="/agenda"
      className={`group block rounded-2xl border bg-card text-card-foreground shadow-soft p-4 sm:p-5 transition hover:shadow-petal hover:-translate-y-0.5 active:scale-[0.99] ${
        isCurrent ? "border-[var(--gold)] ring-1 ring-[var(--gold)]/40" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{year} · {short}</div>
          <div className="font-serif text-2xl sm:text-[1.7rem] mt-0.5 leading-none">{label}</div>
        </div>
        <span className={`text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full ${stage.tone} whitespace-nowrap`}>
          <span className="mr-1">{stage.emoji}</span>{stage.name}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        <MiniStat label="Tarefas" value={`${doneTasks}/${totalTasks}`} pct={Math.round(taskPct)} tone="gold" />
        <MiniStat label="Hábitos" value={`${habitsPct}%`} pct={habitsPct} tone="sage" />
        <MiniStat label="Metas" value={`${metasDone}/${metasTotal}`} pct={Math.round(metasPct)} tone="rose" />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Smile className="h-3.5 w-3.5" />
          <span className="text-lg leading-none">{moodLabel}</span>
        </span>
        <span className="flex items-center gap-1 group-hover:text-[var(--gold)] transition">
          <Flower2 className="h-3.5 w-3.5" /> abrir →
        </span>
      </div>
    </Link>
  );
}

function MiniStat({ label, value, pct, tone }: { label: string; value: string; pct: number; tone: "gold" | "rose" | "sage" }) {
  const fill =
    tone === "rose" ? "bg-[var(--rose)]" :
    tone === "sage" ? "bg-[var(--sage)]" :
    "gradient-gold";
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground/80">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${fill} rounded-full transition-all`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
