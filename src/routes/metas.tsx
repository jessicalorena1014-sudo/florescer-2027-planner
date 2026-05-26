import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Target, Briefcase, Heart, Wallet, Users, Sparkles, Sprout, Calendar } from "lucide-react";
import { PageHeader, Card, CheckList, ProgressBar } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/metas")({ component: Metas });

type Periodo = "ano" | "mes" | "semana" | "acoes";

const periodos: { key: Periodo; label: string; sub: string }[] = [
  { key: "ano", label: "Ano", sub: "Sonhos de 2027" },
  { key: "mes", label: "Mês", sub: "Foco do mês atual" },
  { key: "semana", label: "Semana", sub: "Próximos 7 dias" },
  { key: "acoes", label: "Pequenas ações", sub: "Passos diários" },
];

const categorias = [
  { key: "dev", label: "Desenvolvimento pessoal", icon: Sparkles, tone: "gold" as const },
  { key: "saude", label: "Saúde & bem-estar", icon: Heart, tone: "rose" as const },
  { key: "carreira", label: "Carreira", icon: Briefcase, tone: "gold" as const },
  { key: "financas", label: "Finanças", icon: Wallet, tone: "sage" as const },
  { key: "relacionamentos", label: "Relacionamentos", icon: Users, tone: "rose" as const },
  { key: "experiencias", label: "Experiências", icon: Sprout, tone: "sage" as const },
];

type Item = { id: string; text: string; done: boolean };

function CategoriaCard({ periodo, cat }: { periodo: Periodo; cat: typeof categorias[number] }) {
  const [items] = useLocalState<Item[]>(`metas:${periodo}:${cat.key}`, []);
  const total = items.length;
  const done = items.filter((i) => i.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
            <cat.icon className="h-4 w-4 text-[var(--gold)]" />
          </div>
          <div>
            <div className="font-serif text-xl leading-tight">{cat.label}</div>
            <div className="text-xs text-muted-foreground">{done} de {total} · {pct}%</div>
          </div>
        </div>
      </div>
      <ProgressBar value={pct} tone={cat.tone} />
      <div className="mt-4">
        <CheckList storageKey={`metas:${periodo}:${cat.key}`} placeholder="Adicionar meta..." />
      </div>
    </Card>
  );
}

function Metas() {
  const [periodo, setPeriodo] = useState<Periodo>("ano");
  const current = periodos.find((p) => p.key === periodo)!;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Suas intenções" title="Metas" subtitle="Cultive cada área da sua vida com clareza." icon={Target} />

      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {periodos.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriodo(p.key)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm transition flex items-center gap-2 ${
              periodo === p.key
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> {p.label}
          </button>
        ))}
      </div>

      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{current.sub}</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categorias.map((c) => (
          <CategoriaCard key={c.key} periodo={periodo} cat={c} />
        ))}
      </div>
    </div>
  );
}
