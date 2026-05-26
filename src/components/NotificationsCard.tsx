import { Bell, BellOff, Check } from "lucide-react";
import { Card } from "@/components/AppShell";
import {
  notifSupported, requestNotifPermission, useNotifSettings,
} from "@/lib/notifications";
import { useEffect, useState } from "react";

export function NotificationsCard() {
  const [s, setS] = useNotifSettings();
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (!notifSupported()) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission);
  }, []);

  const enable = async () => {
    if (!notifSupported()) return;
    const p = await requestNotifPermission();
    setPerm(p);
    setS({ ...s, enabled: p === "granted" });
  };

  const toggleKind = (k: "task" | "event" | "note") =>
    setS({ ...s, [k]: !s[k] });

  const setLead = (n: number) => setS({ ...s, leadMinutes: n });

  const active = s.enabled && perm === "granted";

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
          {active ? <Bell className="h-4 w-4 text-[var(--gold)]" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif text-xl leading-tight">Lembretes</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {perm === "unsupported"
              ? "Seu navegador não suporta notificações."
              : perm === "denied"
              ? "Permissão negada — ative as notificações nas preferências do navegador."
              : active
              ? "Você receberá um aviso suave antes de cada compromisso."
              : "Ative para receber lembretes locais antes das tarefas e eventos."}
          </div>
        </div>
        {perm !== "unsupported" && (
          <button
            onClick={active ? () => setS({ ...s, enabled: false }) : enable}
            className={`shrink-0 h-9 px-4 rounded-full text-xs uppercase tracking-[0.2em] transition ${
              active
                ? "bg-secondary text-foreground border border-border"
                : "bg-[var(--gold)] text-primary-foreground shadow-soft"
            }`}
          >
            {active ? "Desativar" : "Ativar"}
          </button>
        )}
      </div>

      {active && (
        <div className="mt-5 pt-5 border-t border-border space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Avisar para
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { k: "task" as const, label: "Tarefas" },
                { k: "event" as const, label: "Eventos" },
                { k: "note" as const, label: "Notas" },
              ]).map(({ k, label }) => {
                const on = s[k];
                return (
                  <button
                    key={k}
                    onClick={() => toggleKind(k)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs transition border ${
                      on
                        ? "bg-[var(--gold)]/20 border-[var(--gold)] text-foreground"
                        : "bg-secondary/50 border-transparent text-muted-foreground"
                    }`}
                  >
                    {on && <Check className="h-3 w-3" />} {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Antecedência
            </div>
            <div className="flex flex-wrap gap-2">
              {[0, 5, 10, 15, 30, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => setLead(m)}
                  className={`px-3 py-1.5 rounded-full text-xs transition ${
                    s.leadMinutes === m
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === 0 ? "Na hora" : `${m} min antes`}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground italic">
            Os lembretes são entregues localmente enquanto o planner está aberto.
          </p>
        </div>
      )}
    </Card>
  );
}
