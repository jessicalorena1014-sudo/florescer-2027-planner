import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, BookHeart, Wind, Sprout, Heart } from "lucide-react";
import { PageHeader, Card, TextField } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/reflexoes")({ component: Reflexoes });

const prompts = [
  { key: "aprendi", label: "O que aprendi?", icon: BookHeart, placeholder: "Lições recentes, descobertas, percepções..." },
  { key: "deixo", label: "O que deixo para trás?", icon: Wind, placeholder: "Crenças, hábitos, peso que você solta..." },
  { key: "cresco", label: "Onde quero crescer?", icon: Sprout, placeholder: "Áreas que pedem cuidado e expansão..." },
  { key: "gratidao", label: "Gratidão", icon: Heart, placeholder: "Pelo que seu coração agradece hoje..." },
];

function Reflexoes() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Pause" title="Reflexões" subtitle="Quatro perguntas para se reencontrar." icon={Sparkles} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {prompts.map((p) => <Prompt key={p.key} promptKey={p.key} label={p.label} icon={p.icon} placeholder={p.placeholder} />)}
      </div>
    </div>
  );
}

function Prompt({ promptKey: k, label, icon: Icon, placeholder }: { promptKey: string; label: string; icon: React.ComponentType<{ className?: string }>; placeholder: string }) {
  const [v, setV] = useLocalState<string>(`reflexao:${k}`, "");
  return (
    <Card className="min-h-[260px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 rounded-2xl bg-secondary flex items-center justify-center">
          <Icon className="h-4 w-4 text-[var(--gold)]" />
        </div>
        <div className="font-serif text-2xl">{label}</div>
      </div>
      <TextField
        value={v}
        onChange={setV}
        multiline
        rows={7}
        placeholder={placeholder}
        className="font-serif text-base italic leading-7 flex-1"
      />
    </Card>
  );
}
