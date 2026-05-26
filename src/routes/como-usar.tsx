import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays, Target, Sprout, Smile, Sparkles, Save, HelpCircle, RotateCcw,
} from "lucide-react";
import { Card, PageHeader } from "@/components/AppShell";
import { useTutorial } from "@/lib/tutorial";

export const Route = createFileRoute("/como-usar")({
  head: () => ({
    meta: [
      { title: "Como usar — Florescer 2027" },
      { name: "description", content: "Guia gentil de como aproveitar cada espaço do seu planner Florescer 2027." },
    ],
  }),
  component: ComoUsar,
});

const sections = [
  {
    icon: CalendarDays,
    title: "Agenda",
    text: "Crie compromissos para qualquer dia, com recorrência diária, semanal ou mensal. Use os lembretes para não esquecer e o botão PDF para exportar o resumo do mês.",
  },
  {
    icon: Target,
    title: "Metas",
    text: "Organize sonhos por período — ano, mês, semana — e celebre cada pequena ação concluída. O progresso é calculado automaticamente.",
  },
  {
    icon: Sprout,
    title: "Hábitos",
    text: "Acompanhe seus rituais diários e veja seu Jardim Florescer desabrochar a cada hábito cumprido. Consistência gentil vale mais que perfeição.",
  },
  {
    icon: Smile,
    title: "Humor",
    text: "Registre como você se sente todos os dias. Com o tempo, padrões aparecem e você se conhece melhor.",
  },
  {
    icon: Sparkles,
    title: "Reflexões e Diário",
    text: "Escreva livremente. Use o Diário para o dia a dia, as Reflexões para perguntas que te movem e o Brain Dump para esvaziar a mente.",
  },
  {
    icon: Save,
    title: "Salvamento",
    text: "Tudo é salvo automaticamente no seu aparelho. Funciona offline e seus dados ficam com você — nada vai para fora sem sua permissão.",
  },
];

function ComoUsar() {
  const { restart } = useTutorial();

  return (
    <>
      <PageHeader
        eyebrow="Guia"
        title="Como usar este planner"
        subtitle="Um passeio gentil por cada cantinho do Florescer. Sem pressa — você decide o ritmo."
        icon={HelpCircle}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="flex gap-4">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-[var(--accent)]/40 border border-border grid place-items-center">
              <Icon className="h-5 w-5 text-[var(--gold)]" strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-2xl leading-tight">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{text}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Tutorial</div>
          <h2 className="font-serif text-2xl mt-1">Quer rever o tour de boas-vindas?</h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Reabra as telas iniciais a qualquer momento.
          </p>
        </div>
        <button
          onClick={restart}
          className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:opacity-95 active:scale-[0.99] transition"
        >
          <RotateCcw className="h-4 w-4" /> Ver tutorial novamente
        </button>
      </Card>
    </>
  );
}
