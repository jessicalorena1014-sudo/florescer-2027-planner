import { useState } from "react";
import { CalendarDays, Sprout, Flower2, Sparkles, ChevronRight, ChevronLeft, X } from "lucide-react";
import { useTutorial } from "@/lib/tutorial";

type Slide = {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  text: string;
};

const slides: Slide[] = [
  {
    icon: Sparkles,
    eyebrow: "Bem-vinda",
    title: "Bem-vinda ao Florescer 2027",
    text: "Seu planner delicado para cultivar uma rotina com intenção. Vamos te mostrar como aproveitar cada cantinho.",
  },
  {
    icon: CalendarDays,
    eyebrow: "Agenda",
    title: "Agenda inteligente",
    text: "Crie compromissos com recorrência diária, semanal ou mensal. Receba lembretes e veja seu mês de relance.",
  },
  {
    icon: Sprout,
    eyebrow: "Cuidado diário",
    title: "Hábitos e autocuidado",
    text: "Acompanhe água, humor, sono e suas pequenas práticas. Pequenos passos, grandes colheitas.",
  },
  {
    icon: Flower2,
    eyebrow: "Florescer",
    title: "Jardim Florescer",
    text: "Cada hábito cumprido faz uma florzinha desabrochar no seu jardim. Veja seu progresso florescer.",
  },
];

export function TutorialOverlay() {
  const { shouldShow, finish } = useTutorial();
  const [i, setI] = useState(0);

  if (!shouldShow) return null;

  const slide = slides[i];
  const isLast = i === slides.length - 1;
  const Icon = slide.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-bloom" onClick={finish} />
      <div className="relative w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-petal animate-bloom safe-area-pb">
        <button
          onClick={finish}
          aria-label="Pular tutorial"
          className="absolute top-3 right-3 h-10 w-10 grid place-items-center rounded-full hover:bg-secondary active:scale-95 transition text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pt-10 pb-6 sm:pt-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-[var(--accent)]/40 border border-border grid place-items-center shadow-soft">
            <Icon className="h-7 w-7 text-[var(--gold)]" strokeWidth={1.5} />
          </div>
          <div className="mt-5 text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            {slide.eyebrow}
          </div>
          <h2 id="tutorial-title" className="font-serif text-3xl sm:text-4xl leading-tight mt-2">
            {slide.title}
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {slide.text}
          </p>

          {/* Dots */}
          <div className="mt-7 flex items-center justify-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Ir para slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-6 bg-[var(--gold)]" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-5 pb-5 sm:pb-6 flex items-center gap-3">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            aria-label="Anterior"
            className="h-12 w-12 grid place-items-center rounded-2xl border border-border bg-background/60 hover:bg-secondary active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {isLast ? (
            <button
              onClick={finish}
              className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-medium tracking-wide shadow-soft hover:opacity-95 active:scale-[0.99] transition"
            >
              Começar meu planejamento
            </button>
          ) : (
            <button
              onClick={() => setI((v) => Math.min(slides.length - 1, v + 1))}
              className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-medium tracking-wide shadow-soft hover:opacity-95 active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
            >
              Próximo <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
