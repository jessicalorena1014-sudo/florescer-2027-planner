import { useLocalState } from "./storage";

export type Recurrence = "none" | "daily" | "weekly" | "monthly";
export type EventKind = "task" | "event" | "note";

export type AgendaEvent = {
  id: string;
  title: string;
  notes?: string;
  date: string; // ISO yyyy-mm-dd (start date)
  time?: string; // HH:mm
  kind: EventKind;
  recurrence: Recurrence;
  done?: boolean;
  completions?: string[]; // ISO dates marked done (for recurring)
};

export function useAgenda() {
  return useLocalState<AgendaEvent[]>("agenda:events", []);
}

export function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromYmd(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function sameDay(a: Date, b: Date) {
  return ymd(a) === ymd(b);
}

export function isToday(d: Date) {
  return sameDay(d, new Date());
}

export function occursOn(ev: AgendaEvent, date: Date): boolean {
  const start = fromYmd(ev.date);
  if (date < new Date(start.getFullYear(), start.getMonth(), start.getDate())) return false;
  switch (ev.recurrence) {
    case "none":
      return sameDay(start, date);
    case "daily":
      return true;
    case "weekly":
      return start.getDay() === date.getDay();
    case "monthly":
      return start.getDate() === date.getDate();
  }
}

export function eventsOn(events: AgendaEvent[], date: Date) {
  return events
    .filter((e) => occursOn(e, date))
    .sort((a, b) => (a.time || "99").localeCompare(b.time || "99"));
}

export function isDone(ev: AgendaEvent, date: Date) {
  if (ev.recurrence === "none") return !!ev.done;
  return (ev.completions || []).includes(ymd(date));
}

export function toggleDone(ev: AgendaEvent, date: Date): AgendaEvent {
  if (ev.recurrence === "none") return { ...ev, done: !ev.done };
  const key = ymd(date);
  const c = new Set(ev.completions || []);
  if (c.has(key)) c.delete(key);
  else c.add(key);
  return { ...ev, completions: [...c] };
}

// ===== Jardim Florescer gamification =====
export type GardenStage = {
  name: "Semente" | "Broto" | "Flor" | "Buquê";
  emoji: string;
  next?: number; // points to next level
};

export function gardenStage(points: number): GardenStage & { progress: number } {
  if (points < 10) return { name: "Semente", emoji: "🌱", next: 10, progress: (points / 10) * 100 };
  if (points < 30) return { name: "Broto", emoji: "🌿", next: 30, progress: ((points - 10) / 20) * 100 };
  if (points < 60) return { name: "Flor", emoji: "🌸", next: 60, progress: ((points - 30) / 30) * 100 };
  return { name: "Buquê", emoji: "💐", progress: 100 };
}

export function countCompletions(events: AgendaEvent[]): number {
  let n = 0;
  for (const e of events) {
    if (e.done) n++;
    n += (e.completions || []).length;
  }
  return n;
}
