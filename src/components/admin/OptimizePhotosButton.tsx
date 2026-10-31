import { useState } from "react";
import { ImageDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { otimizarFotos, type Bucket, type TabelaComFotos } from "@/lib/optimize-photos";

/** Botão de manutenção: deixa as fotos já cadastradas dentro do limite do WhatsApp. */
export function OptimizePhotosButton({
  tabela,
  bucket,
  aoTerminar,
}: {
  tabela: TabelaComFotos;
  bucket: Bucket;
  aoTerminar?: () => void;
}) {
  const [rodando, setRodando] = useState(false);
  const [progresso, setProgresso] = useState("");

  async function rodar() {
    setRodando(true);
    try {
      const r = await otimizarFotos(tabela, bucket, setProgresso);
      if (r.reduzidas === 0 && r.falhas === 0) {
        toast.success(`Todas as ${r.verificadas} fotos já estão no tamanho certo.`);
      } else {
        toast.success(
          `${r.reduzidas} foto(s) reduzida(s) de ${r.verificadas}.` +
            (r.falhas ? ` ${r.falhas} não puderam ser reduzidas — tente pelo computador.` : ""),
        );
      }
      aoTerminar?.();
    } catch (err) {
      toast.error(`Não foi possível otimizar as fotos: ${(err as Error).message}`);
    } finally {
      setRodando(false);
      setProgresso("");
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant="outline" onClick={() => void rodar()} disabled={rodando}>
        {rodando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageDown className="mr-2 h-4 w-4" />}
        Otimizar fotos para o WhatsApp
      </Button>
      <span className="text-xs text-muted-foreground">
        {rodando ? progresso : "Reduz as fotos grandes (acima de 2 MB). A foto antiga continua guardada."}
      </span>
    </div>
  );
}
