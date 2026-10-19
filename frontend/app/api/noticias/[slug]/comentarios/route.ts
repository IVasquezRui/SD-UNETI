import { connection, NextResponse } from "next/server";
import { WP_REST_URL } from "../../../../lib/wordpress";

const SLUG_VALIDO = /^[a-z0-9-]+$/i;

function endpoint(slug: string): string | null {
  if (!SLUG_VALIDO.test(slug)) return null;
  return `${WP_REST_URL}/wp-json/uneti/v1/comentarios/${encodeURIComponent(slug)}`;
}

type ComentarioPayload = {
  nombre?: string;
  correo?: string;
  contenido?: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;
  const url = endpoint(slug);

  if (!url) {
    return NextResponse.json({ error: "Noticia no válida." }, { status: 400 });
  }

  try {
    const respuesta = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const payload = await respuesta.json();
    return NextResponse.json(payload, { status: respuesta.status });
  } catch (error) {
    console.error("[comentarios] GET", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los comentarios." },
      { status: 502 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;
  const url = endpoint(slug);

  if (!url) {
    return NextResponse.json({ error: "Noticia no válida." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as ComentarioPayload | null;
  const nombre = payload?.nombre?.trim() ?? "";
  const contenido = payload?.contenido?.trim() ?? "";
  const correo = payload?.correo?.trim() ?? "";

  if (nombre.length < 2) {
    return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  }
  if (contenido.length < 3) {
    return NextResponse.json({ error: "El comentario es demasiado corto." }, { status: 400 });
  }
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return NextResponse.json({ error: "El correo no es válido." }, { status: 400 });
  }

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ nombre, correo, contenido }),
    });
    const data = await respuesta.json();
    return NextResponse.json(data, { status: respuesta.status });
  } catch (error) {
    console.error("[comentarios] POST", error);
    return NextResponse.json(
      { error: "No se pudo publicar el comentario." },
      { status: 502 },
    );
  }
}
