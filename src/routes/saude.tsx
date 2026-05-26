import { createFileRoute } from "@tanstack/react-router";
import { Heart, Battery, Smile, Moon, Droplets, Apple, Stethoscope, Sparkles, HandHeart } from "lucide-react";
import { PageHeader, Card, CheckList, TextField } from "@/components/Primitives";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/saude")({ component: Saude });

function Saude() {
  const [energia, setEnergia] = useLocalState<number>("saude:energia", 70);
  const [humor, setHumor] = useLocalState<string>("saude:humor", "😊");
  const [sono, setSono] = useLocalState<number>("saude:sono", 7);
  const [agua, setAgua] = useLocalState<number>("saude:agua", 5);
  const [afirmacao, setAfirmacao] = useLocalState<string>("saude:afirmacao", "Eu floresço a cada dia.");

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Você inteira" title="Saúde" subtitle="Corpo, mente e coração — observados com carinho." icon={Heart} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Battery className="h-3.5 w-3.5" /> Energia
          </div>
          <div className="font-serif text-3xl mt-2">{energia}%</div>
          <input type="range" min="0" max="100" value={energia} onChange={(e) => setEnergia(+e.target.value)} className="w-full mt-2 accent-[var(--gold)]" />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Smile className="h-3.5 w-3.5" /> Humor
          </div>
          <div className="font-serif text-3xl mt-2">{humor}</div>
          <div className="flex gap-1 mt-2">
            {["😊","🌷","😌","😔","😴","🥰"].map((m) => (
              <button key={m} onClick={() => setHumor(m)} className={`h-8 w-8 rounded-lg text-lg ${humor === m ? "bg-secondary" : "hover:bg-secondary/60"}`}>{m}</button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Moon className="h-3.5 w-3.5" /> Sono
          </div>
          <div className="font-serif text-3xl mt-2">{sono}h</div>
          <input type="range" min="0" max="12" value={sono} onChange={(e) => setSono(+e.target.value)} className="w-full mt-2 accent-[var(--gold)]" />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" /> Água
          </div>
          <div className="font-serif text-3xl mt-2">{agua}<span className="text-base text-muted-foreground">/8</span></div>
          <div className="flex gap-1 mt-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <button key={i} onClick={() => setAgua(i + 1 === agua ? i : i + 1)} className={`h-2 flex-1 rounded-full ${i < agua ? "bg-[var(--gold)]" : "bg-muted"}`} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Apple className="h-3.5 w-3.5" /> Alimentação
          </div>
          <CheckList storageKey="saude:alimentacao" placeholder="Café da manhã, frutas, água..." />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Stethoscope className="h-3.5 w-3.5" /> Consultas
          </div>
          <CheckList storageKey="saude:consultas" placeholder="Próximas consultas e exames..." />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="gradient-cream">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Afirmação do dia
          </div>
          <TextField
            value={afirmacao}
            onChange={setAfirmacao}
            multiline
            rows={3}
            className="font-serif text-2xl italic text-center"
          />
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <HandHeart className="h-3.5 w-3.5" /> Gratidão
          </div>
          <CheckList storageKey="saude:gratidao" placeholder="Sou grata por..." />
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          <Heart className="h-3.5 w-3.5" /> Autocuidado realizado
        </div>
        <CheckList storageKey="saude:autocuidado" placeholder="Banho relaxante, leitura, caminhada..." />
      </Card>
    </div>
  );
}
