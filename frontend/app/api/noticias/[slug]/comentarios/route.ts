import { connection, NextResponse } from "next/server";
import { limitar, obtenerIp } from "../../../../lib/rate-limit";
import {
  LIMITE_CUERPO_COMENTARIO,
  errorCuerpo,
  leerJsonLimitado,
} from "../../../../lib/security";
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
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();

  const limite = limitar(`comentarios:get:${obtenerIp(request)}`, 60, 60 * 1000);
  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiadas consultas. Espera un momento." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

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

  const limite = limitar(`comentarios:post:${obtenerIp(request)}`, 10, 10 * 60 * 1000);
  if (!limite.permitido) {
    const segundos = Math.max(1, Math.ceil((limite.reinicio - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Demasiados comentarios. Espera unos minutos." },
      { status: 429, headers: { "Retry-After": String(segundos) } },
    );
  }

  const { slug } = await params;
  const url = endpoint(slug);

  if (!url) {
    return NextResponse.json({ error: "Noticia no válida." }, { status: 400 });
  }

  const lectura = await leerJsonLimitado<ComentarioPayload>(
    request,
    LIMITE_CUERPO_COMENTARIO,
  );

  if (!lectura.ok) {
    const { status, error } = errorCuerpo(lectura.motivo);
    return NextResponse.json({ error }, { status });
  }

  const payload = lectura.datos;
  const nombre = payload?.nombre?.trim() ?? "";
  const contenido = payload?.contenido?.trim() ?? "";
  const correo = payload?.correo?.trim() ?? "";

  if (nombre.length < 2 || nombre.length > 80) {
    return NextResponse.json({ error: "Escribe un nombre válido." }, { status: 400 });
  }
  if (contenido.length < 3 || contenido.length > 2000) {
    return NextResponse.json(
      { error: "El comentario debe tener entre 3 y 2000 caracteres." },
      { status: 400 },
    );
  }
  if (correo.length > 120 || (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))) {
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
