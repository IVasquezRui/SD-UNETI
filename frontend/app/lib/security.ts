import { timingSafeEqual } from "node:crypto";

/** Límites de cuerpo para las rutas que aceptan JSON. */
export const LIMITE_CUERPO_FORMULARIO = 16 * 1024;
export const LIMITE_CUERPO_COMENTARIO = 8 * 1024;
export const LIMITE_CUERPO_REVALIDACION = 2 * 1024;

/** Compara dos tokens en tiempo constante (evita ataques de temporización). */
export function tokensIguales(a: string, b: string): boolean {
  if (!a || !b) return false;

  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");

  if (bufferA.length !== bufferB.length) return false;

  return timingSafeEqual(bufferA, bufferB);
}

type Lectura<T> =
  | { ok: true; datos: T }
  | { ok: false; motivo: "grande" | "invalido" };

/**
 * Lee y valida un cuerpo JSON sin confiar en el tamaño declarado.
 * Devuelve `grande` si supera el límite y `invalido` si no es JSON.
 */
export async function leerJsonLimitado<T>(
  request: Request,
  maximo: number,
): Promise<Lectura<T>> {
  const declarado = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declarado) && declarado > maximo) {
    return { ok: false, motivo: "grande" };
  }

  const texto = await request.text().catch(() => "");
  if (!texto) return { ok: false, motivo: "invalido" };

  if (Buffer.byteLength(texto, "utf8") > maximo) {
    return { ok: false, motivo: "grande" };
  }

  try {
    return { ok: true, datos: JSON.parse(texto) as T };
  } catch {
    return { ok: false, motivo: "invalido" };
  }
}

/** Respuesta estándar para cuerpos inválidos o demasiado grandes. */
export function errorCuerpo(motivo: "grande" | "invalido"): { status: number; error: string } {
  return motivo === "grande"
    ? { status: 413, error: "El contenido enviado es demasiado grande." }
    : { status: 400, error: "No pudimos leer los datos enviados." };
}
