import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, Check, Search, X, Clock, Repeat,
} from "lucide-react";
import { PageHeader, Card } from "@/components/AppShell";
import {
  useAgenda, ymd, fromYmd, isToday, eventsOn, isDone, toggleDone,
  type AgendaEvent, type Recurrence, type EventKind,
} from "@/lib/agenda";

export const Route = createFileRoute("/agenda")({ component: Agenda });

type View = "month" | "week" | "day";

const WEEKDAYS_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];
const WEEKDAYS_LONG = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function Agenda() {
  const [events, setEvents] = useAgenda();
  const [cursor, setCursor] = useState<Date>(() => new Date());
  const [selected, setSelected] = useState<Date>(() => new Date());
  const [view, setView] = useState<View>("month");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AgendaEvent | null>(null);

  const update = (next: AgendaEvent) =>
    setEvents(events.map((e) => (e.id === next.id ? next : e)));
  const remove = (id: string) => setEvents(events.filter((e) => e.id !== id));
  const create = (ev: AgendaEvent) => setEvents([...events, ev]);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return events.filter(
      (e) => e.title.toLowerCase().includes(q) || (e.notes || "").toLowerCase().includes(q),
    );
  }, [search, events]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sua agenda"
        title="Calendário"
        subtitle="Organize seus dias com leveza — tudo salvo automaticamente."
        icon={CalendarDays}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setCursor(shift(cursor, view, -1))} className="h-10 w-10 rounded-full bg-card border border-border hover:bg-secondary flex items-center justify-center">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="font-serif text-2xl sm:text-3xl min-w-[180px] text-center">
            {labelFor(cursor, view)}
          </div>
          <button onClick={() => setCursor(shift(cursor, view, 1))} className="h-10 w-10 rounded-full bg-card border border-border hover:bg-secondary flex items-center justify-center">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => { const d = new Date(); setCursor(d); setSelected(d); }}
            className="ml-2 px-3 h-9 rounded-full text-xs uppercase tracking-[0.2em] bg-card border border-border hover:bg-secondary"
          >
            Hoje
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex rounded-full bg-card border border-border p-1">
            {(["month","week","day"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 h-8 rounded-full text-xs uppercase tracking-[0.18em] transition ${
                  view === v ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "month" ? "Mês" : v === "week" ? "Semana" : "Dia"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setEditing(blank(ymd(selected)))}
            className="h-10 px-4 rounded-full bg-[var(--gold)] text-primary-foreground flex items-center gap-2 shadow-soft hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Novo
          </button>
        </div>
      </div>

      {/* Search */}
      <Card className="flex items-center gap-3 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tarefas, eventos e anotações..."
          className="flex-1 bg-transparent border-0 outline-none text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </Card>

      {filtered ? (
        <SearchResults
          results={filtered}
          onPick={(ev) => {
            const d = fromYmd(ev.date);
            setSelected(d); setCursor(d); setSearch(""); setView("day");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-4 sm:p-6">
            {view === "month" && (
              <MonthGrid
                cursor={cursor}
                selected={selected}
                events={events}
                onSelect={(d) => { setSelected(d); }}
                onOpenDay={(d) => { setSelected(d); setCursor(d); setView("day"); }}
              />
            )}
            {view === "week" && (
              <WeekView
                cursor={cursor}
                selected={selected}
                events={events}
                onSelect={(d) => setSelected(d)}
                onToggle={(ev, d) => update(toggleDone(ev, d))}
              />
            )}
            {view === "day" && (
              <DayView
                date={cursor}
                events={events}
                onToggle={(ev) => update(toggleDone(ev, cursor))}
                onEdit={(ev) => setEditing(ev)}
                onRemove={remove}
              />
            )}
          </Card>

          <Card>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <DayList
              date={selected}
              events={events}
              onToggle={(ev) => update(toggleDone(ev, selected))}
              onEdit={(ev) => setEditing(ev)}
              onRemove={remove}
            />
            <button
              onClick={() => setEditing(blank(ymd(selected)))}
              className="mt-4 w-full rounded-2xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:bg-secondary/60 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Adicionar nesta data
            </button>
          </Card>
        </div>
      )}

      {editing && (
        <EventEditor
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={(ev) => {
            if (events.some((e) => e.id === ev.id)) update(ev);
            else create(ev);
            setEditing(null);
          }}
          onDelete={() => { remove(editing.id); setEditing(null); }}
          exists={events.some((e) => e.id === editing.id)}
        />
      )}
    </div>
  );
}

// ===== Helpers =====
function blank(date: string): AgendaEvent {
  return {
    id: crypto.randomUUID(),
    title: "",
    date,
    kind: "task",
    recurrence: "none",
  };
}
function shift(d: Date, view: View, dir: number) {
  const n = new Date(d);
  if (view === "month") n.setMonth(n.getMonth() + dir);
  else if (view === "week") n.setDate(n.getDate() + 7 * dir);
  else n.setDate(n.getDate() + dir);
  return n;
}
function labelFor(d: Date, view: View) {
  if (view === "month") return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  if (view === "day") return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
  const start = startOfWeek(d);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  return `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()].slice(0,3)}`;
}
function startOfWeek(d: Date) {
  const n = new Date(d);
  n.setDate(n.getDate() - n.getDay());
  n.setHours(0,0,0,0);
  return n;
}

// ===== Month grid =====
function MonthGrid({ cursor, selected, events, onSelect, onOpenDay }: {
  cursor: Date; selected: Date; events: AgendaEvent[];
  onSelect: (d: Date) => void; onOpenDay: (d: Date) => void;
}) {
  const y = cursor.getFullYear(), m = cursor.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const totalDays = new Date(y, m + 1, 0).getDate();

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {WEEKDAYS_SHORT.map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const d = new Date(y, m, i + 1);
          const today = isToday(d);
          const isSel = ymd(d) === ymd(selected);
          const dayEvents = eventsOn(events, d);
          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              onDoubleClick={() => onOpenDay(d)}
              className={`aspect-square rounded-xl sm:rounded-2xl p-1 sm:p-2 flex flex-col items-start gap-1 text-left transition border ${
                isSel ? "bg-[var(--gold)]/20 border-[var(--gold)]" :
                today ? "bg-secondary border-[var(--gold)]/40" :
                "bg-card/60 border-transparent hover:bg-secondary/60"
              }`}
            >
              <span className={`text-xs sm:text-sm font-medium ${today ? "text-[var(--gold)]" : ""}`}>
                {i + 1}
              </span>
              <div className="flex flex-wrap gap-0.5 mt-auto">
                {dayEvents.slice(0,3).map((e) => (
                  <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${
                    e.kind === "event" ? "bg-[var(--rose)]" :
                    e.kind === "note" ? "bg-[var(--sage)]" : "bg-[var(--gold)]"
                  }`} />
                ))}
                {dayEvents.length > 3 && <span className="text-[9px] text-muted-foreground">+{dayEvents.length-3}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===== Week view =====
function WeekView({ cursor, selected, events, onSelect, onToggle }: {
  cursor: Date; selected: Date; events: AgendaEvent[];
  onSelect: (d: Date) => void; onToggle: (ev: AgendaEvent, d: Date) => void;
}) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i); return d;
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
      {days.map((d) => {
        const isSel = ymd(d) === ymd(selected);
        return (
          <button
            key={d.toISOString()}
            onClick={() => onSelect(d)}
            className={`text-left rounded-2xl border p-3 min-h-[160px] transition ${
              isToday(d) ? "border-[var(--gold)]/60" :
              isSel ? "border-[var(--gold)]" : "border-border bg-card/60"
            }`}
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{WEEKDAYS_LONG[d.getDay()].slice(0,3)}</div>
            <div className={`font-serif text-2xl ${isToday(d) ? "text-[var(--gold)]" : ""}`}>{d.getDate()}</div>
            <div className="mt-2 space-y-1">
              {eventsOn(events, d).map((ev) => (
                <div key={ev.id} onClick={(e) => { e.stopPropagation(); onToggle(ev, d); }}
                  className="flex items-center gap-1.5 text-[11px] truncate">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    isDone(ev, d) ? "bg-muted" : "bg-[var(--gold)]"
                  }`} />
                  <span className={isDone(ev, d) ? "line-through text-muted-foreground" : ""}>
                    {ev.time && <span className="text-muted-foreground mr-1">{ev.time}</span>}
                    {ev.title}
                  </span>
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ===== Day views =====
function DayView({ date, events, onToggle, onEdit, onRemove }: {
  date: Date; events: AgendaEvent[];
  onToggle: (ev: AgendaEvent) => void; onEdit: (ev: AgendaEvent) => void; onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
        {date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
      </div>
      <DayList date={date} events={events} onToggle={onToggle} onEdit={onEdit} onRemove={onRemove} large />
    </div>
  );
}

function DayList({ date, events, onToggle, onEdit, onRemove, large = false }: {
  date: Date; events: AgendaEvent[];
  onToggle: (ev: AgendaEvent) => void; onEdit: (ev: AgendaEvent) => void; onRemove: (id: string) => void; large?: boolean;
}) {
  const list = eventsOn(events, date);
  if (list.length === 0) {
    return <div className="text-sm italic text-muted-foreground py-6 text-center">Nada agendado neste dia.</div>;
  }
  return (
    <div className={large ? "space-y-2" : "space-y-1.5"}>
      {list.map((ev) => {
        const done = isDone(ev, date);
        return (
          <div key={ev.id} className="group flex items-center gap-3 rounded-2xl bg-secondary/40 hover:bg-secondary/70 px-3 py-2 transition">
            <button
              onClick={() => onToggle(ev)}
              className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                done ? "bg-[var(--gold)] border-[var(--gold)] text-primary-foreground" : "border-border bg-card"
              }`}
            >
              {done && <Check className="h-3 w-3" />}
            </button>
            <div className="flex-1 min-w-0" onClick={() => onEdit(ev)} role="button">
              <div className={`text-sm ${done ? "line-through text-muted-foreground" : ""}`}>{ev.title}</div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                {ev.time && (<><Clock className="h-3 w-3" />{ev.time}</>)}
                {ev.recurrence !== "none" && (<><Repeat className="h-3 w-3" />{labelRec(ev.recurrence)}</>)}
                <span className="capitalize">{ev.kind === "task" ? "tarefa" : ev.kind === "event" ? "evento" : "nota"}</span>
              </div>
            </div>
            <button onClick={() => onRemove(ev.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function labelRec(r: Recurrence) {
  return r === "daily" ? "diária" : r === "weekly" ? "semanal" : r === "monthly" ? "mensal" : "";
}

function SearchResults({ results, onPick }: { results: AgendaEvent[]; onPick: (e: AgendaEvent) => void }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
        {results.length} resultado{results.length !== 1 ? "s" : ""}
      </div>
      <div className="space-y-2">
        {results.map((e) => (
          <button key={e.id} onClick={() => onPick(e)} className="w-full text-left rounded-xl px-3 py-2 hover:bg-secondary/60 flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${e.kind === "event" ? "bg-[var(--rose)]" : e.kind === "note" ? "bg-[var(--sage)]" : "bg-[var(--gold)]"}`} />
            <span className="flex-1 truncate text-sm">{e.title}</span>
            <span className="text-xs text-muted-foreground">{fromYmd(e.date).toLocaleDateString("pt-BR")}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ===== Editor modal =====
function EventEditor({ value, onSave, onCancel, onDelete, exists }: {
  value: AgendaEvent; onSave: (ev: AgendaEvent) => void; onCancel: () => void; onDelete: () => void; exists: boolean;
}) {
  const [draft, setDraft] = useState<AgendaEvent>(value);
  const set = <K extends keyof AgendaEvent>(k: K, v: AgendaEvent[K]) => setDraft({ ...draft, [k]: v });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-petal p-6 animate-bloom">
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-2xl">{exists ? "Editar" : "Novo"}</div>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <input
            autoFocus
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Título..."
            className="w-full bg-secondary/50 rounded-2xl px-4 py-3 text-base outline-none border border-transparent focus:border-[var(--gold)]"
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-muted-foreground space-y-1">
              Data
              <input type="date" value={draft.date} onChange={(e) => set("date", e.target.value)}
                className="w-full bg-secondary/50 rounded-xl px-3 py-2 text-sm outline-none" />
            </label>
            <label className="text-xs text-muted-foreground space-y-1">
              Hora
              <input type="time" value={draft.time || ""} onChange={(e) => set("time", e.target.value || undefined)}
                className="w-full bg-secondary/50 rounded-xl px-3 py-2 text-sm outline-none" />
            </label>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Tipo</div>
            <div className="flex gap-2">
              {(["task","event","note"] as EventKind[]).map((k) => (
                <button key={k} onClick={() => set("kind", k)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs transition ${draft.kind === k ? "bg-[var(--gold)]/25 border border-[var(--gold)]" : "bg-secondary/50 border border-transparent"}`}>
                  {k === "task" ? "Tarefa" : k === "event" ? "Evento" : "Nota"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Repetir</div>
            <div className="flex gap-2">
              {(["none","daily","weekly","monthly"] as Recurrence[]).map((r) => (
                <button key={r} onClick={() => set("recurrence", r)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs transition ${draft.recurrence === r ? "bg-[var(--gold)]/25 border border-[var(--gold)]" : "bg-secondary/50 border border-transparent"}`}>
                  {r === "none" ? "Não" : r === "daily" ? "Diária" : r === "weekly" ? "Semanal" : "Mensal"}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={draft.notes || ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Anotações..."
            rows={3}
            className="w-full bg-secondary/50 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
          />

          <div className="flex items-center gap-2 pt-2">
            {exists && (
              <button onClick={onDelete} className="h-10 px-4 rounded-full border border-border text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2">
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </button>
            )}
            <button
              disabled={!draft.title.trim()}
              onClick={() => onSave(draft)}
              className="ml-auto h-10 px-5 rounded-full bg-[var(--gold)] text-primary-foreground text-sm disabled:opacity-50 shadow-soft"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
