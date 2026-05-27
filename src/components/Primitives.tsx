import { useState } from "react";
import { Card, PageHeader } from "@/components/AppShell";
import { useLocalState } from "@/lib/storage";
import {
  Plus, Trash2, Check, GripVertical,
} from "lucide-react";

export function TextField({
  value, onChange, placeholder, multiline = false, rows = 4, className = "",
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  multiline?: boolean; rows?: number; className?: string;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground/60 ${className}`}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 ${className}`}
    />
  );
}

export function CheckList({ storageKey, placeholder = "Adicionar item..." }: { storageKey: string; placeholder?: string }) {
  type Item = { id: string; text: string; done: boolean };
  const [items, setItems] = useLocalState<Item[]>(storageKey, []);
  const [draft, setDraft] = useState("");

  const add = () => {
    if (!draft.trim()) return;
    setItems([...items, { id: crypto.randomUUID(), text: draft.trim(), done: false }]);
    setDraft("");
  };

  return (
    <div className="space-y-1.5">
      {items.map((it) => (
        <div key={it.id} className="group flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-secondary/60 transition">
          <button
            onClick={() => setItems(items.map((x) => x.id === it.id ? { ...x, done: !x.done } : x))}
            className={`h-5 w-5 rounded-md border flex items-center justify-center transition ${
              it.done ? "bg-[var(--gold)] border-[var(--gold)] text-primary-foreground" : "border-border"
            }`}
          >
            {it.done && <Check className="h-3 w-3" />}
          </button>
          <span className={`flex-1 text-sm ${it.done ? "line-through text-muted-foreground" : ""}`}>{it.text}</span>
          <button
            onClick={() => setItems(items.filter((x) => x.id !== it.id))}
            aria-label="Excluir item"
            className="h-9 w-9 grid place-items-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 md:opacity-0 md:group-hover:opacity-100 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-2 pl-2">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground/60 py-1"
        />
      </div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, tone = "gold" }: { value: number; max?: number; tone?: "gold" | "rose" | "sage" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const fill = tone === "rose" ? "bg-[var(--rose)]" : tone === "sage" ? "bg-[var(--sage)]" : "gradient-gold";
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className={`h-full ${fill} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export { Card, PageHeader };
export { GripVertical };
