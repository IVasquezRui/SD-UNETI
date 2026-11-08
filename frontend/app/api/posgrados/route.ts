import { NextResponse } from "next/server";
import { validarSolicitud } from "../../lib/solicitudes";
import { enviarSolicitudAWp } from "../../lib/solicitudes-wp";
import { limitar, obtenerIp, origenValido } from "../../lib/rate-limit";
import {
  LIMITE_CUERPO_FORMULARIO,
  errorCuerpo,
  leerJsonLimitado,
} from "../../lib/security";

const MAXIMO = 5;
const VENTANA_MS = 10 * 60 * 1000;

/**
 * Solicitudes de admisión a los PNFA (posgrados).
 *
 * Mismo flujo y mismas herramientas que `/api/admisiones`: validación
 * compartida, rate limit por IP y reenvío a WordPress con `X-UNETI-Token`.
 * WordPress devuelve el folio que el frontend muestra como número de ticket.
 */
export async function POST(request: Request) {
  if (!origenValido(request)) {
    return NextResponse.json({ ok: false, error: "Origen no permitido." }, { status: 403 });
  }

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "El contenido debe enviarse como JSON." },
      { status: 415 },
    );
  }

  const ip = obtenerIp(request);
  const limite = limitar(`posgrado:${ip}`, MAXIMO, VENTANA_MS);

  if (!limite.permitido) {
    const segundos = Math.max(1, Math.ceil((limite.reinicio - Date.now()) / 1000));
    return NextResponse.json(
      {
        ok: false,
        error: "Demasiadas solicitudes. Espera unos minutos antes de volver a intentarlo.",
      },
      { status: 429, headers: { "Retry-After": String(segundos) } },
    );
  }

  const lectura = await leerJsonLimitado<Record<string, unknown>>(
    request,
    LIMITE_CUERPO_FORMULARIO,
  );

  if (!lectura.ok) {
    const { status, error } = errorCuerpo(lectura.motivo);
    return NextResponse.json({ ok: false, error }, { status });
  }

  const payload = lectura.datos;

  // Honeypot: un bot que complete este campo recibe una respuesta falsa de éxito.
  if (payload && typeof payload.sitio_web === "string" && payload.sitio_web.trim() !== "") {
    return NextResponse.json({ ok: true, folio: null, ticket: null }, { status: 201 });
  }

  const resultado = validarSolicitud(payload, "posgrado");

  if (!resultado.valido || !resultado.datos) {
    return NextResponse.json(
      {
        ok: false,
        error: "Revisa los datos del formulario.",
        errores: resultado.errores,
      },
      { status: 400 },
    );
  }

  const envio = await enviarSolicitudAWp(resultado.datos, ip);

  if (!envio.ok) {
    return NextResponse.json(
      { ok: false, error: envio.error ?? "No pudimos registrar la solicitud." },
      { status: envio.status },
    );
  }

  return NextResponse.json(
    { ok: true, folio: envio.folio, ticket: envio.folio, id: envio.id },
    { status: 201 },
  );
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Método no permitido." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
