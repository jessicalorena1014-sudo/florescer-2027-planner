import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Sunrise, Moon, Clock } from "lucide-react";
import { PageHeader, Card, CheckList } from "@/components/Primitives";

export const Route = createFileRoute("/rotina")({ component: Rotina });

const blocos = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

function Rotina() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sua estrutura" title="Rotina" subtitle="Crie um ritmo que sustenta sua leveza." icon={ListChecks} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-[var(--gold)]/8 via-card to-transparent">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Sunrise className="h-3.5 w-3.5" /> Rotina da manhã
          </div>
          <CheckList storageKey="rotina:manha" placeholder="Acordar, água, alongar..." />
        </Card>
        <Card className="bg-gradient-to-br from-[var(--rose)]/10 via-card to-transparent">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Moon className="h-3.5 w-3.5" /> Rotina da noite
          </div>
          <CheckList storageKey="rotina:noite" placeholder="Skincare, leitura, gratidão..." />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Clock className="h-3.5 w-3.5" /> Bloco de tempo
          </div>
          <div className="space-y-2">
            {blocos.map((b) => <TimeBlock key={b} time={b} />)}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <ListChecks className="h-3.5 w-3.5" /> Tarefas do dia
          </div>
          <CheckList storageKey="rotina:tarefas" />
        </Card>
      </div>
    </div>
  );
}

function TimeBlock({ time }: { time: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-border/60 last:border-0">
      <div className="font-serif text-sm w-14 text-muted-foreground">{time}</div>
      <input
        placeholder="..."
        className="flex-1 bg-transparent border-0 outline-none text-sm py-1"
      />
    </div>
  );
}
