import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Bell, Target, Sparkles } from "lucide-react";
import { PageHeader, Card, TextField, CheckList } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/visao-anual")({ component: VisaoAnual });

const months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function VisaoAnual() {
  const [foco, setFoco] = useLocalState<string>("visao:foco", "");
  const year = 2027;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="2027" title="Visão Anual" subtitle="Veja o ano inteiro de uma só vez e plante sua intenção." icon={Calendar} />

      <Card className="bg-gradient-to-br from-[var(--gold)]/10 via-card to-[var(--rose)]/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Foco do ano
        </div>
        <TextField
          value={foco}
          onChange={setFoco}
          placeholder="Qual é a essência de 2027 para você?"
          className="font-serif text-3xl sm:text-4xl mt-3 italic"
        />
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((m, i) => (
          <Card key={m} className="hover:shadow-petal transition">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{year}</div>
            <div className="font-serif text-2xl mt-1">{m}</div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }).map((_, d) => (
                <div key={d} className="aspect-square rounded bg-muted/60" />
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Target className="h-3.5 w-3.5" /> Metas do ano
          </div>
          <CheckList storageKey="visao:metas" placeholder="Adicione uma meta para 2027..." />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Bell className="h-3.5 w-3.5" /> Lembretes
          </div>
          <CheckList storageKey="visao:lembretes" placeholder="Aniversários, datas, marcos..." />
        </Card>
      </div>
    </div>
  );
}
