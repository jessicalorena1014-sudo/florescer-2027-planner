import { createFileRoute } from "@tanstack/react-router";
import { Sprout, Droplets, Dumbbell, Moon, BookOpen, Smile, Flower2, Flame, Trophy } from "lucide-react";
import { PageHeader, Card, ProgressBar } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/habitos")({ component: Habitos });

const habits = [
  { key: "agua", label: "Água", icon: Droplets },
  { key: "exercicios", label: "Exercícios", icon: Dumbbell },
  { key: "sono", label: "Sono", icon: Moon },
  { key: "leitura", label: "Leitura", icon: BookOpen },
  { key: "humor", label: "Humor", icon: Smile },
  { key: "autocuidado", label: "Autocuidado", icon: Flower2 },
];

function Habitos() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Cultive" title="Hábitos" subtitle="Pequenas sementes diárias para uma colheita constante." icon={Sprout} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <SummaryCard icon={Flame} label="Sequência atual" value="12" sub="dias seguidos" />
        <SummaryCard icon={Trophy} label="Conquistas" value="07" sub="medalhas" />
        <SummaryCard icon={Sprout} label="Hábitos ativos" value="6" sub="em cultivo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {habits.map((h) => <HabitTracker key={h.key} habitKey={h.key} icon={h.icon} label={h.label} />)}
      </div>
    </div>
  );
}

function HabitTracker({ icon: Icon, label, habitKey: k }: { icon: React.ComponentType<{ className?: string }>; label: string; habitKey: string }) {
  const [done, setDone] = useLocalState<Record<string, boolean>>(`habit:${k}`, {});
  const today = new Date();
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const completed = days.filter((d) => done[d]).length;
  const pct = Math.round((completed / 30) * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
            <Icon className="h-4 w-4 text-[var(--gold)]" />
          </div>
          <div className="font-serif text-xl">{label}</div>
        </div>
        <div className="text-xs text-muted-foreground">{completed}/30 · {pct}%</div>
      </div>
      <ProgressBar value={pct} />
      <div className="mt-4 grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setDone({ ...done, [d]: !done[d] })}
            title={d}
            className={`aspect-square rounded transition ${
              done[d] ? "bg-[var(--gold)] shadow-soft" : "bg-muted hover:bg-secondary"
            }`}
          />
        ))}
      </div>
    </Card>
  );
}

function SummaryCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub: string }) {
  return (
    <Card>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="font-serif text-4xl mt-2">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </Card>
  );
}
