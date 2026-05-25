import { createFileRoute } from "@tanstack/react-router";
import { Notebook } from "lucide-react";
import { PageHeader, Card, TextField } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/diario")({ component: Diario });

function Diario() {
  const today = new Date().toISOString().slice(0, 10);
  const [entry, setEntry] = useLocalState<string>(`diario:${today}`, "");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        title="Diário"
        subtitle="Sua página em branco. Sem julgamento — apenas honestidade."
        icon={Notebook}
      />

      <Card className="lined-paper min-h-[60vh] p-8 sm:p-12">
        <TextField
          value={entry}
          onChange={setEntry}
          multiline
          rows={24}
          placeholder="Hoje eu sinto que..."
          className="font-serif text-xl leading-8 italic bg-transparent"
        />
      </Card>
    </div>
  );
}
