/**
 * Ajusta uma foto ao padrão de envio do WhatsApp ANTES do upload — sem nunca
 * recusar a foto do usuário.
 *
 * Por quê (review 2026-09-24): o WhatsApp (Meta) só entrega imagem até 5 MB.
 * Acima disso a Graph API aceita o pedido e a entrega falha depois, em
 * silêncio. Fotos de celular passam fácil disso (a do operador em 05/09 tinha
 * 6,5 MB).
 *
 * Estratégia: primeiro reduzir as DIMENSÕES (lado maior até 1600 px, que é mais
 * que o WhatsApp exibe), depois a QUALIDADE em passos, até ficar abaixo do alvo.
 * Se nada disso bastar, reduz mais as dimensões. Qualquer erro devolve o
 * arquivo original — a validação do envio (evolution-send) continua como rede.
 *
 * Sem dependência: createImageBitmap + canvas, disponíveis nos navegadores
 * suportados. Espelhado do Aurora (Nexus), mesmo padrão de foto — as fotos
 * deste cadastro são enviadas aos clientes pelo WhatsApp da suíte.
 */

const MAX_SIDE_PX = 1600;
const TARGET_BYTES = 1024 * 1024; // alvo: abaixo de 1 MB
const HARD_LIMIT_BYTES = 5 * 1024 * 1024; // limite de imagem da Meta
const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55, 0.45];
const FALLBACK_SIDES = [1280, 1024, 800];

// Formatos que não vale converter: GIF perderia animação e SVG é vetor.
const SKIP_TYPES = new Set(["image/gif", "image/svg+xml"]);

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

async function render(bitmap: ImageBitmap, maxSide: number): Promise<HTMLCanvasElement> {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d indisponível");
  // JPEG não tem transparência: fundo branco evita PNG transparente virar preto.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function renamed(name: string): string {
  const base = name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name;
  return `${base || "foto"}.jpg`;
}

/** Devolve a foto ajustada ao padrão, ou a original se já estiver dentro dele
 * (ou se algo falhar). Arquivos que não são imagem passam intactos. */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || SKIP_TYPES.has(file.type)) return file;

  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const alreadyOk =
      file.size <= TARGET_BYTES && Math.max(bitmap.width, bitmap.height) <= MAX_SIDE_PX;
    if (alreadyOk) return file;

    let best: Blob | null = null;
    for (const side of [MAX_SIDE_PX, ...FALLBACK_SIDES]) {
      const canvas = await render(bitmap, side);
      for (const q of QUALITY_STEPS) {
        const blob = await toBlob(canvas, q);
        if (!blob) continue;
        if (!best || blob.size < best.size) best = blob;
        if (blob.size <= TARGET_BYTES) {
          return new File([blob], renamed(file.name), { type: "image/jpeg" });
        }
      }
      // Não chegou no alvo, mas já está dentro do limite da Meta: aceitável.
      if (best && best.size <= HARD_LIMIT_BYTES) break;
    }
    // Só troca se a conversão realmente ajudou.
    if (best && best.size < file.size) {
      return new File([best], renamed(file.name), { type: "image/jpeg" });
    }
    return file;
  } catch (err) {
    console.warn("[image-compress] mantendo a foto original:", err);
    return file;
  } finally {
    bitmap?.close();
  }
}
