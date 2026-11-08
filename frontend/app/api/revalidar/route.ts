import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { limitar, obtenerIp } from "../../lib/rate-limit";
import {
  LIMITE_CUERPO_REVALIDACION,
  leerJsonLimitado,
  tokensIguales,
} from "../../lib/security";

/**
 * Revalidación bajo demanda del contenido publicado en WordPress.
 *
 * Uso (desde un webhook de WordPress o manualmente):
 *   curl -X POST http://localhost:3000/api/revalidar \
 *     -H "Content-Type: application/json" \
 *     -H "X-UNETI-Token: $UNETI_REVALIDATE_TOKEN" \
 *     -d '{"slug":"uneti-abre-convocatoria-admision-2026"}'
 *
 * El token es servidor-a-servidor y nunca debe llevar el prefijo NEXT_PUBLIC_.
 */
export async function POST(request: Request) {
  const limite = limitar(`revalidar:${obtenerIp(request)}`, 20, 60 * 1000);
  if (!limite.permitido) {
    return NextResponse.json(
      { ok: false, error: "Demasiadas revalidaciones. Espera un minuto." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const esperado = process.env.UNETI_REVALIDATE_TOKEN ?? process.env.WP_FORM_TOKEN ?? "";
  const recibido = request.headers.get("x-uneti-token") ?? "";

  if (!esperado) {
    return NextResponse.json(
      { ok: false, error: "La revalidación no está configurada." },
      { status: 503 },
    );
  }

  if (!tokensIguales(recibido, esperado)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const lectura = await leerJsonLimitado<{ slug?: unknown }>(
    request,
    LIMITE_CUERPO_REVALIDACION,
  );
  const slugBruto = lectura.ok && typeof lectura.datos?.slug === "string" ? lectura.datos.slug : "";
  const slug = slugBruto.trim().slice(0, 200);

  revalidateTag("noticias", "max");
  revalidatePath("/");
  revalidatePath("/noticias");

  if (slug) {
    revalidateTag(`noticia-${slug}`, "max");
    revalidatePath(`/noticias/${slug}`);
  }

  return NextResponse.json({ ok: true, revalidado: true, slug: slug || null });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Método no permitido." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
