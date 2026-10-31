/**
 * Otimiza as fotos JÁ cadastradas para o padrão de envio do WhatsApp.
 *
 * Por quê (31/10/2026): o upload já reduz a foto (image-compress), mas a
 * redução pode falhar no aparelho — fotos de 7-8 MB do Filhote 11 e do
 * FILHOTE 6 subiram assim em 01/10. Acima de 5 MB o WhatsApp não entrega.
 *
 * Roda no navegador de quem administra (com o login dele — RLS), foto por foto:
 * baixa, reduz com a MESMA rotina do upload, sobe a versão nova na mesma pasta
 * e troca o endereço no registro. A foto antiga NÃO é apagada (dá para voltar).
 */

import { supabase } from "@/integrations/supabase/client";
import { compressImageForUpload } from "@/lib/image-compress";

/** Acima disto a foto é refeita (o alvo da redução é 1 MB). */
const LIMITE_BYTES = 2 * 1024 * 1024;

export type TabelaComFotos = "puppies" | "dogs";
export type Bucket = "puppy-images" | "dog-images";

export interface ResultadoOtimizacao {
  verificadas: number;
  reduzidas: number;
  falhas: number;
}

async function tamanho(url: string): Promise<number> {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return Number(res.headers.get("content-length") || 0);
  } catch {
    return 0;
  }
}

/** Pasta da foto dentro do bucket ("australian_shepherd-puppies"), ou "". */
export function pastaDaFoto(url: string, bucket: Bucket): string | null {
  const marca = `/${bucket}/`;
  const i = url.indexOf(marca);
  if (i < 0) return null;
  const caminho = decodeURIComponent(url.slice(i + marca.length).split("?")[0]);
  const barra = caminho.lastIndexOf("/");
  return barra >= 0 ? caminho.slice(0, barra) : "";
}

async function refazer(url: string, bucket: Bucket): Promise<string | null> {
  const pasta = pastaDaFoto(url, bucket);
  if (pasta === null) return null; // foto de outro lugar: não mexe
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const blob = await res.blob();
  const original = new File([blob], url.split("/").pop() || "foto.jpg", { type: blob.type || "image/jpeg" });
  const reduzida = await compressImageForUpload(original);
  if (reduzida.size >= original.size || reduzida.size > 5 * 1024 * 1024) return null;
  const nome = `${Math.random().toString(36).substring(2)}-${Date.now()}.jpg`;
  const caminho = pasta ? `${pasta}/${nome}` : nome;
  const { error } = await supabase.storage.from(bucket).upload(caminho, reduzida, { contentType: "image/jpeg" });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(caminho).data.publicUrl;
}

export async function otimizarFotos(
  tabela: TabelaComFotos,
  bucket: Bucket,
  aoProgredir?: (texto: string) => void,
): Promise<ResultadoOtimizacao> {
  const resultado: ResultadoOtimizacao = { verificadas: 0, reduzidas: 0, falhas: 0 };
  const { data, error } = await supabase.from(tabela).select("id, name, image_url, images");
  if (error) throw new Error(error.message);

  for (const registro of data ?? []) {
    const fotos = [...(registro.images ?? [])];
    let capa = registro.image_url;
    let mudou = false;
    for (const url of new Set([...fotos, ...(capa ? [capa] : [])])) {
      resultado.verificadas += 1;
      aoProgredir?.(`${registro.name}: conferindo foto ${resultado.verificadas}…`);
      if ((await tamanho(url)) <= LIMITE_BYTES) continue;
      try {
        const nova = await refazer(url, bucket);
        if (!nova) {
          resultado.falhas += 1;
          continue;
        }
        fotos.forEach((f, k) => {
          if (f === url) fotos[k] = nova;
        });
        if (capa === url) capa = nova;
        mudou = true;
        resultado.reduzidas += 1;
      } catch (err) {
        console.warn("[otimizar-fotos]", registro.name, url, err);
        resultado.falhas += 1;
      }
    }
    if (mudou) {
      const { error: erroUpdate } = await supabase
        .from(tabela)
        .update({ images: fotos, image_url: capa })
        .eq("id", registro.id);
      if (erroUpdate) throw new Error(`${registro.name}: ${erroUpdate.message}`);
    }
  }
  return resultado;
}
