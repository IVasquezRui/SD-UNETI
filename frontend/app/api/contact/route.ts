import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Payload aceptado por los formularios de inscripción, becas y contacto. */
type LeadPayload = {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null;

  if (!payload || typeof payload.email !== "string" || !EMAIL_PATTERN.test(payload.email)) {
    return NextResponse.json({ ok: false, error: "Se requiere un correo electrónico válido." }, { status: 400 });
  }

  if (payload.type !== "newsletter" && (!payload.name || payload.name.trim().length < 2)) {
    return NextResponse.json({ ok: false, error: "El campo nombre es obligatorio." }, { status: 400 });
  }

  // TODO: reenviar a WordPress (WPGraphQL mutation) o a un servicio SMTP/CRM.
  // Mientras tanto se registra en los logs del contenedor para trazabilidad.
  console.info("[lead]", {
    type: payload.type ?? "contact",
    name: payload.name ?? "",
    email: payload.email,
    phone: payload.phone ?? "",
    subject: payload.subject ?? "",
    message: payload.message ?? "",
  });

  return NextResponse.json({ ok: true });
}
