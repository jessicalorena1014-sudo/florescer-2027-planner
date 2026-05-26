import { useEffect } from "react";
import { useLocalState } from "./storage";
import { fromYmd, occursOn, type AgendaEvent, type EventKind } from "./agenda";

export type NotifSettings = {
  enabled: boolean;
  task: boolean;
  event: boolean;
  note: boolean;
  leadMinutes: number; // minutes before event time
};

export const defaultNotifSettings: NotifSettings = {
  enabled: false,
  task: true,
  event: true,
  note: false,
  leadMinutes: 10,
};

export function useNotifSettings() {
  return useLocalState<NotifSettings>("notif:settings", defaultNotifSettings);
}

export function notifSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotifPermission(): Promise<NotificationPermission> {
  if (!notifSupported()) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  return await Notification.requestPermission();
}

export function isTypeEnabled(s: NotifSettings, kind: EventKind) {
  if (!s.enabled) return false;
  return kind === "task" ? s.task : kind === "event" ? s.event : s.note;
}

function fireNotification(ev: AgendaEvent) {
  if (!notifSupported() || Notification.permission !== "granted") return;
  const title =
    ev.kind === "task" ? "🌱 Tarefa" : ev.kind === "event" ? "🌸 Evento" : "📝 Lembrete";
  try {
    new Notification(`${title} — ${ev.title}`, {
      body: ev.notes || (ev.time ? `Às ${ev.time}` : "Lembrete do seu planner."),
      tag: `florescer-${ev.id}-${ev.date}`,
      icon: "/favicon.ico",
    });
  } catch {
    /* ignore */
  }
}

/**
 * Schedules in-page notifications for events occurring today (and within the next
 * ~12h). Uses setTimeout — works only while the tab is open.
 */
export function useScheduleNotifications(events: AgendaEvent[], settings: NotifSettings) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!settings.enabled || !notifSupported() || Notification.permission !== "granted") {
      return;
    }

    const now = new Date();
    const horizonMs = 12 * 60 * 60 * 1000;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Check today + tomorrow to cover events shortly after midnight.
    const candidates: Date[] = [new Date(now), new Date(now.getTime() + 24 * 60 * 60 * 1000)];

    for (const ev of events) {
      if (!ev.time) continue;
      if (!isTypeEnabled(settings, ev.kind)) continue;
      const [h, m] = ev.time.split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) continue;

      for (const day of candidates) {
        if (!occursOn(ev, day)) continue;
        const start = fromYmd(ev.date);
        if (day < new Date(start.getFullYear(), start.getMonth(), start.getDate())) continue;

        const when = new Date(day);
        when.setHours(h, m, 0, 0);
        const fireAt = when.getTime() - settings.leadMinutes * 60 * 1000;
        const delay = fireAt - now.getTime();
        if (delay <= 0 || delay > horizonMs) continue;

        timers.push(setTimeout(() => fireNotification(ev), delay));
      }
    }

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [events, settings]);
}
