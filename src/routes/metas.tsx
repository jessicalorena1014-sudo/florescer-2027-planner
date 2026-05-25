import { createFileRoute } from "@tanstack/react-router";
import { Target, Briefcase, Heart, Wallet, Users, Sparkles, Sprout } from "lucide-react";
import { PageHeader, Card, CheckList, ProgressBar } from "@/components/Primitives";

export const Route = createFileRoute("/metas")({ component: Metas });

const categorias = [
  { key: "dev", label: "Desenvolvimento pessoal", icon: Sparkles, tone: "gold" as const, pct: 35 },
  { key: "saude", label: "Saúde & bem-estar", icon: Heart, tone: "rose" as const, pct: 60 },
  { key: "carreira", label: "Carreira", icon: Briefcase, tone: "gold" as const, pct: 20 },
  { key: "financas", label: "Finanças", icon: Wallet, tone: "sage" as const, pct: 45 },
  { key: "relacionamentos", label: "Relacionamentos", icon: Users, tone: "rose" as const, pct: 70 },
  { key: "experiencias", label: "Experiências", icon: Sprout, tone: "sage" as const, pct: 15 },
];

function Metas() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Suas intenções" title="Metas" subtitle="Cultive cada área da sua vida com clareza." icon={Target} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categorias.map((c) => (
          <Card key={c.key}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
                  <c.icon className="h-4 w-4 text-[var(--gold)]" />
                </div>
                <div>
                  <div className="font-serif text-xl leading-tight">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.pct}% concluído</div>
                </div>
              </div>
            </div>
            <ProgressBar value={c.pct} tone={c.tone} />
            <div className="mt-4">
              <CheckList storageKey={`metas:${c.key}`} placeholder="Adicionar meta..." />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
