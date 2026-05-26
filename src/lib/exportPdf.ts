import jsPDF from "jspdf";
import {
  type AgendaEvent,
  eventsOn,
  fromYmd,
  isDone,
  ymd,
} from "./agenda";

const PREFIX = "florescer-2027:";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const periodos = [
  { key: "ano", label: "Ano" },
  { key: "mes", label: "Mês" },
  { key: "semana", label: "Semana" },
  { key: "acoes", label: "Pequenas ações" },
] as const;

const categorias = [
  { key: "dev", label: "Desenvolvimento pessoal" },
  { key: "saude", label: "Saúde & bem-estar" },
  { key: "carreira", label: "Carreira" },
  { key: "financas", label: "Finanças" },
  { key: "relacionamentos", label: "Relacionamentos" },
  { key: "experiencias", label: "Experiências" },
];

type MetaItem = { id: string; text: string; done: boolean };

function readMetas(periodo: string, cat: string): MetaItem[] {
  try {
    const raw = localStorage.getItem(`${PREFIX}metas:${periodo}:${cat}`);
    return raw ? (JSON.parse(raw) as MetaItem[]) : [];
  } catch {
    return [];
  }
}

export function exportMonthSummary(events: AgendaEvent[], reference: Date) {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const monthLabel = `${MESES[month]} ${year}`;

  // Collect all event occurrences within the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDay: { date: Date; items: AgendaEvent[] }[] = [];
  let totalOccurrences = 0;
  let totalDone = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const items = eventsOn(events, date);
    if (items.length) {
      byDay.push({ date, items });
      totalOccurrences += items.length;
      for (const it of items) if (isDone(it, date)) totalDone++;
    }
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 110, 70);
  doc.setFontSize(10);
  doc.text("PLANNER FLORESCER 2027", margin, y);
  y += 14;

  doc.setTextColor(40, 30, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(`Resumo de ${monthLabel}`, margin, y + 16);
  y += 32;

  doc.setDrawColor(220, 200, 170);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + contentW, y);
  y += 18;

  // Stats
  const pct = totalOccurrences ? Math.round((totalDone / totalOccurrences) * 100) : 0;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 65, 50);
  doc.text(
    `${totalOccurrences} compromissos · ${totalDone} concluídos · ${pct}% do mês realizado`,
    margin,
    y,
  );
  y += 22;

  // ===== Agenda section =====
  ensureSpace(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(40, 30, 20);
  doc.text("Agenda do mês", margin, y);
  y += 16;

  if (byDay.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(140, 120, 100);
    doc.text("Nenhum compromisso registrado neste mês.", margin, y);
    y += 18;
  } else {
    for (const { date, items } of byDay) {
      ensureSpace(28);
      const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(60, 50, 40);
      doc.text(`${String(date.getDate()).padStart(2, "0")} · ${weekday}`, margin, y);
      y += 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const it of items) {
        const done = isDone(it, date);
        const checkbox = done ? "[x]" : "[ ]";
        const time = it.time ? `${it.time} ` : "";
        const kindLabel =
          it.kind === "task" ? "Tarefa" : it.kind === "event" ? "Evento" : "Nota";
        const line = `${checkbox} ${time}${it.title}  ·  ${kindLabel}`;
        const wrapped = doc.splitTextToSize(line, contentW - 14);
        ensureSpace(wrapped.length * 12 + 2);
        doc.setTextColor(done ? 160 : 50, done ? 145 : 40, done ? 125 : 30);
        doc.text(wrapped, margin + 14, y);
        y += wrapped.length * 12;
      }
      y += 6;
    }
  }

  // ===== Metas section =====
  ensureSpace(48);
  y += 8;
  doc.setDrawColor(220, 200, 170);
  doc.line(margin, y, margin + contentW, y);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(40, 30, 20);
  doc.text("Metas", margin, y);
  y += 18;

  for (const p of periodos) {
    // Aggregate categorias under this periodo
    const blocks: { cat: string; items: MetaItem[] }[] = [];
    let pTotal = 0;
    let pDone = 0;
    for (const c of categorias) {
      const items = readMetas(p.key, c.key);
      if (items.length === 0) continue;
      blocks.push({ cat: c.label, items });
      pTotal += items.length;
      pDone += items.filter((i) => i.done).length;
    }
    if (blocks.length === 0) continue;

    ensureSpace(30);
    const pPct = pTotal ? Math.round((pDone / pTotal) * 100) : 0;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60, 50, 40);
    doc.text(`${p.label}  —  ${pDone}/${pTotal} (${pPct}%)`, margin, y);
    y += 14;

    for (const b of blocks) {
      ensureSpace(20);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(130, 105, 75);
      doc.text(b.cat, margin + 8, y);
      y += 12;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      for (const it of b.items) {
        const checkbox = it.done ? "[x]" : "[ ]";
        const line = `${checkbox} ${it.text}`;
        const wrapped = doc.splitTextToSize(line, contentW - 22);
        ensureSpace(wrapped.length * 12 + 2);
        doc.setTextColor(it.done ? 160 : 50, it.done ? 145 : 40, it.done ? 125 : 30);
        doc.text(wrapped, margin + 22, y);
        y += wrapped.length * 12;
      }
      y += 6;
    }
    y += 8;
  }

  // Footer on each page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(170, 150, 125);
    doc.text(
      `Florescer 2027 · ${monthLabel} · página ${i} de ${pages}`,
      pageW / 2,
      pageH - 24,
      { align: "center" },
    );
  }

  const safe = monthLabel.toLowerCase().replace(/\s+/g, "-").replace(/ç/g, "c").replace(/[^a-z0-9-]/g, "");
  doc.save(`florescer-2027-resumo-${safe}.pdf`);

  // Silence the unused import warning for fromYmd / ymd if tree-shaking complains
  void fromYmd; void ymd;
}
