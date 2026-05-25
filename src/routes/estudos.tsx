import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, RefreshCcw, Layers, CalendarClock } from "lucide-react";
import { PageHeader, Card, CheckList, ProgressBar } from "@/components/Primitives";

export const Route = createFileRoute("/estudos")({ component: Estudos });

const materias = [
  { key: "leitura", label: "Leitura", pct: 60 },
  { key: "linguas", label: "Idiomas", pct: 30 },
  { key: "cursos", label: "Cursos online", pct: 45 },
  { key: "carreira", label: "Habilidades de carreira", pct: 25 },
];

function Estudos() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Cresça" title="Estudos" subtitle="Cultive a mente com curiosidade e constância." icon={BookOpen} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {materias.map((m) => (
          <Card key={m.key}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              <Layers className="h-3.5 w-3.5" /> {m.label}
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <div className="font-serif text-2xl">Progresso</div>
              <div className="text-sm text-muted-foreground">{m.pct}%</div>
            </div>
            <ProgressBar value={m.pct} />
            <div className="mt-4">
              <CheckList storageKey={`estudos:${m.key}`} placeholder="Adicionar tópico..." />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <RefreshCcw className="h-3.5 w-3.5" /> Revisões
          </div>
          <CheckList storageKey="estudos:revisoes" placeholder="O que precisa revisar?" />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <CalendarClock className="h-3.5 w-3.5" /> Planejamento
          </div>
          <CheckList storageKey="estudos:planejamento" placeholder="Planejar próxima semana..." />
        </Card>
      </div>
    </div>
  );
}
