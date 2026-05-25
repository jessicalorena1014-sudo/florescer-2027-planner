import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Heart, Star } from "lucide-react";
import { PageHeader, Card, CheckList, TextField } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/meses")({ component: Meses });

const months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function Meses() {
  const [active, setActive] = useState(new Date().getMonth());
  const [resumo, setResumo] = useLocalState<string>(`mes:${active}:resumo`, "");

  const firstDay = new Date(2027, active, 1).getDay();
  const days = new Date(2027, active + 1, 0).getDate();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Planejamento" title="Mensal" subtitle="Organize cada mês com gentileza e propósito." icon={CalendarDays} />

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {months.map((m, i) => (
          <button
            key={m}
            onClick={() => setActive(i)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm transition ${
              i === active ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="font-serif text-3xl mb-4">{months[active]} <span className="text-muted-foreground text-xl">2027</span></div>
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            {["D","S","T","Q","Q","S","S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: days }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-secondary/50 hover:bg-[var(--gold)]/20 cursor-pointer flex items-center justify-center text-sm font-medium transition">
                {i + 1}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              <Star className="h-3.5 w-3.5" /> Prioridades
            </div>
            <CheckList storageKey={`mes:${active}:prioridades`} />
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              <CalendarDays className="h-3.5 w-3.5" /> Eventos
            </div>
            <CheckList storageKey={`mes:${active}:eventos`} />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            <Heart className="h-3.5 w-3.5" /> Gratidão
          </div>
          <CheckList storageKey={`mes:${active}:gratidao`} placeholder="Sou grata por..." />
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Resumo do mês</div>
          <TextField
            value={resumo}
            onChange={setResumo}
            multiline
            rows={8}
            placeholder="Como foi este mês para você?"
            className="font-serif text-lg italic"
          />
        </Card>
      </div>
    </div>
  );
}
