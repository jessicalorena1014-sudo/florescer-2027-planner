import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { PageHeader, Card, TextField } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/brain-dump")({ component: BrainDump });

function BrainDump() {
  const [text, setText] = useLocalState<string>("braindump", "");

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Esvazie a mente" title="Brain Dump" subtitle="Deixe tudo cair aqui. Depois você organiza." icon={Brain} />

      <Card className="dotted-paper min-h-[60vh] p-6 sm:p-10">
        <TextField
          value={text}
          onChange={setText}
          multiline
          rows={26}
          placeholder="Tudo que está passando pela sua cabeça agora..."
          className="font-serif text-lg leading-8"
        />
      </Card>
    </div>
  );
}
