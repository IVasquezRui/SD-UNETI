import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

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
  const esperado = process.env.UNETI_REVALIDATE_TOKEN ?? process.env.WP_FORM_TOKEN ?? "";
  const recibido = request.headers.get("x-uneti-token") ?? "";

  if (!esperado) {
    return NextResponse.json(
      { ok: false, error: "La revalidación no está configurada." },
      { status: 503 },
    );
  }

  if (recibido !== esperado) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const cuerpo = (await request.json().catch(() => null)) as { slug?: unknown } | null;
  const slug = typeof cuerpo?.slug === "string" ? cuerpo.slug.trim() : "";

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
