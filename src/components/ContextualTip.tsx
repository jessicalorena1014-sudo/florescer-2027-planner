import { Lightbulb, X } from "lucide-react";
import { useTipSeen } from "@/lib/tutorial";

export function ContextualTip({
  tipKey,
  title,
  children,
}: {
  tipKey: string;
  title?: string;
  children: React.ReactNode;
}) {
  const { seen, markSeen } = useTipSeen(tipKey);
  if (seen) return null;

  return (
    <div
      role="note"
      className="relative mb-4 rounded-3xl border border-border bg-[var(--accent)]/30 px-4 py-3 sm:px-5 sm:py-4 shadow-soft animate-bloom"
    >
      <div className="flex items-start gap-3 pr-8">
        <div className="mt-0.5 h-8 w-8 shrink-0 rounded-2xl bg-card border border-border grid place-items-center">
          <Lightbulb className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.6} />
        </div>
        <div className="min-w-0">
          {title && (
            <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-1">
              Dica
            </div>
          )}
          <div className="text-sm text-foreground/85 leading-relaxed">
            {title && <span className="font-medium">{title} — </span>}
            {children}
          </div>
        </div>
      </div>
      <button
        onClick={markSeen}
        aria-label="Entendi, fechar dica"
        className="absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full text-muted-foreground hover:bg-card active:scale-95 transition"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
