import { NextResponse } from "next/server";
import { validarSolicitud } from "../../lib/solicitudes";
import { enviarSolicitudAWp } from "../../lib/solicitudes-wp";
import { limitar, obtenerIp, origenValido } from "../../lib/rate-limit";
import {
  LIMITE_CUERPO_FORMULARIO,
  errorCuerpo,
  leerJsonLimitado,
} from "../../lib/security";

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAXIMO = 5;
const VENTANA_MS = 10 * 60 * 1000;

type PayloadContacto = {
  type?: string;
  tipo?: string;
  name?: string;
  nombre?: string;
  email?: string;
  correo?: string;
  phone?: string;
  telefono?: string;
  subject?: string;
  asunto?: string;
  message?: string;
  mensaje?: string;
  consentimiento?: boolean | string;
  origen?: string;
  inicio?: number;
  sitio_web?: string;
};

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
  const limite = limitar(`contacto:${ip}`, MAXIMO, VENTANA_MS);

  if (!limite.permitido) {
    const segundos = Math.max(1, Math.ceil((limite.reinicio - Date.now()) / 1000));
    return NextResponse.json(
      {
        ok: false,
        error: "Demasiados envíos. Espera unos minutos antes de volver a intentarlo.",
      },
      { status: 429, headers: { "Retry-After": String(segundos) } },
    );
  }

  const lectura = await leerJsonLimitado<PayloadContacto>(request, LIMITE_CUERPO_FORMULARIO);

  if (!lectura.ok) {
    const { status, error } = errorCuerpo(lectura.motivo);
    return NextResponse.json({ ok: false, error }, { status });
  }

  const payload = lectura.datos;

  if (!payload) {
    return NextResponse.json(
      { ok: false, error: "No pudimos leer los datos enviados." },
      { status: 400 },
    );
  }

  // Boletín del pie de página: se mantiene el registro sin datos personales.
  if ((payload.tipo ?? payload.type) === "newsletter") {
    const correo = (payload.correo ?? payload.email ?? "").trim().toLowerCase();
    if (!PATRON_CORREO.test(correo)) {
      return NextResponse.json(
        { ok: false, error: "Se requiere un correo electrónico válido." },
        { status: 400 },
      );
    }

    console.info("[boletin] alta registrada", { dominio: correo.split("@")[1] ?? "" });
    return NextResponse.json({ ok: true });
  }

  if (typeof payload.sitio_web === "string" && payload.sitio_web.trim() !== "") {
    return NextResponse.json({ ok: true, folio: null }, { status: 201 });
  }

  const normalizado = {
    tipo: "contacto",
    nombre: payload.nombre ?? payload.name ?? "",
    correo: payload.correo ?? payload.email ?? "",
    telefono: payload.telefono ?? payload.phone ?? "",
    asunto: payload.asunto ?? payload.subject ?? "",
    mensaje: payload.mensaje ?? payload.message ?? "",
    consentimiento: payload.consentimiento,
    origen: payload.origen,
    inicio: payload.inicio,
    sitio_web: payload.sitio_web,
  };

  const resultado = validarSolicitud(normalizado, "contacto");

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
      { ok: false, error: envio.error ?? "No pudimos registrar el mensaje." },
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
