import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Receipt, Heart, Target, Plus, Trash2 } from "lucide-react";
import { PageHeader, Card, CheckList } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/financeiro")({ component: Financeiro });

type Tx = { id: string; label: string; value: number; kind: "in" | "out" };

function Financeiro() {
  const [tx, setTx] = useLocalState<Tx[]>("fin:tx", []);
  const [draft, setDraft] = useState({ label: "", value: "", kind: "in" as "in" | "out" });

  const entradas = tx.filter((t) => t.kind === "in").reduce((s, t) => s + t.value, 0);
  const saidas = tx.filter((t) => t.kind === "out").reduce((s, t) => s + t.value, 0);
  const saldo = entradas - saidas;

  const add = () => {
    const v = parseFloat(draft.value.replace(",", "."));
    if (!draft.label.trim() || isNaN(v)) return;
    setTx([...tx, { id: crypto.randomUUID(), label: draft.label.trim(), value: v, kind: draft.kind }]);
    setDraft({ label: "", value: "", kind: draft.kind });
  };

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Suas finanças" title="Financeiro" subtitle="Cuide do seu dinheiro com leveza." icon={Wallet} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[var(--sage)]/12 border-[var(--sage)]/30">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> Entradas
          </div>
          <div className="font-serif text-3xl mt-2">{fmt(entradas)}</div>
        </Card>
        <Card className="bg-[var(--rose)]/12 border-[var(--rose)]/30">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <TrendingDown className="h-3.5 w-3.5" /> Saídas
          </div>
          <div className="font-serif text-3xl mt-2">{fmt(saidas)}</div>
        </Card>
        <Card className="bg-[var(--gold)]/12 border-[var(--gold)]/30">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" /> Saldo
          </div>
          <div className="font-serif text-3xl mt-2">{fmt(saldo)}</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          <Receipt className="h-3.5 w-3.5" /> Movimentações
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            value={draft.label}
            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            placeholder="Descrição"
            className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border outline-none text-sm focus:ring-2 ring-[var(--gold)]/40"
          />
          <input
            value={draft.value}
            onChange={(e) => setDraft({ ...draft, value: e.target.value })}
            placeholder="0,00"
            className="w-full sm:w-32 px-3 py-2 rounded-xl bg-secondary border border-border outline-none text-sm"
          />
          <select
            value={draft.kind}
            onChange={(e) => setDraft({ ...draft, kind: e.target.value as "in" | "out" })}
            className="px-3 py-2 rounded-xl bg-secondary border border-border outline-none text-sm"
          >
            <option value="in">Entrada</option>
            <option value="out">Saída</option>
          </select>
          <button
            onClick={add}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm flex items-center justify-center gap-1 hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>

        {tx.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-6 text-center">
            Resumo mensal vazio — comece registrando seus primeiros movimentos.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {tx.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2.5 group">
                <span className={`h-2 w-2 rounded-full ${t.kind === "in" ? "bg-[var(--sage)]" : "bg-[var(--rose)]"}`} />
                <span className="flex-1 text-sm">{t.label}</span>
                <span className={`font-medium ${t.kind === "in" ? "text-[var(--sage)]" : "text-[var(--rose)]"}`}>
                  {t.kind === "in" ? "+" : "−"} {fmt(t.value)}
                </span>
                <button
                  onClick={() => setTx(tx.filter((x) => x.id !== t.id))}
                  aria-label="Excluir lançamento"
                  className="h-9 w-9 grid place-items-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 md:opacity-0 md:group-hover:opacity-100 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            <Receipt className="h-3.5 w-3.5" /> Contas
          </div>
          <CheckList storageKey="fin:contas" placeholder="Conta de luz, aluguel..." />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            <Heart className="h-3.5 w-3.5" /> Wishlist
          </div>
          <CheckList storageKey="fin:wishlist" placeholder="O que você sonha em ter..." />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            <Target className="h-3.5 w-3.5" /> Metas financeiras
          </div>
          <CheckList storageKey="fin:metas" placeholder="Reserva, investimento..." />
        </Card>
      </div>
    </div>
  );
}
