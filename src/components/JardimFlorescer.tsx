import { Sparkles } from "lucide-react";
import { Card } from "@/components/AppShell";
import { useAgenda, countCompletions, gardenStage } from "@/lib/agenda";

export function JardimFlorescer() {
  const [events] = useAgenda();
  const points = countCompletions(events);
  const stage = gardenStage(points);
  const flowers = Math.min(12, Math.floor(points / 2));

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[var(--rose)]/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Jardim florescer
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="font-serif text-4xl leading-none">
              <span className="mr-2">{stage.emoji}</span>{stage.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {points} conclusõe{points === 1 ? "" : "s"} cultivadas
            </div>
          </div>
          {stage.next && (
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              próximo em {stage.next - points}
            </div>
          )}
        </div>
        <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-gold rounded-full transition-all" style={{ width: `${stage.progress}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`text-xl transition-all ${i < flowers ? "opacity-100 scale-100" : "opacity-25 scale-90 grayscale"}`}>
              {i < 3 ? "🌱" : i < 6 ? "🌿" : i < 9 ? "🌸" : "💐"}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs italic text-muted-foreground">
          Cada tarefa concluída faz seu jardim florescer.
        </p>
      </div>
    </Card>
  );
}
