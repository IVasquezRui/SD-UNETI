import type { SolicitudPayload } from "./solicitudes";

export type ResultadoEnvio = {
  ok: boolean;
  status: number;
  folio?: string;
  /** Identificador interno de la solicitud en WordPress (se muestra como ticket). */
  id?: number;
  error?: string;
};

/**
 * Envía la solicitud al endpoint REST propio de WordPress.
 *
 * Este módulo es solo para el servidor de Next.js: el token nunca se expone
 * al navegador. Si WordPress no está disponible o rechaza la petición, se
 * devuelve un error genérico para no filtrar detalles internos.
 */
export async function enviarSolicitudAWp(
  datos: SolicitudPayload,
  ip: string,
): Promise<ResultadoEnvio> {
  const base = (process.env.WP_INTERNAL_URL ?? "http://localhost:8080").replace(/\/$/, "");
  const token = process.env.WP_FORM_TOKEN ?? "";

  if (!token) {
    console.error("[solicitudes] WP_FORM_TOKEN no está configurado.");
    return {
      ok: false,
      status: 503,
      error: "El servicio de solicitudes no está configurado. Inténtalo más tarde.",
    };
  }

  try {
    const respuesta = await fetch(`${base}/wp-json/uneti/v1/solicitudes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-UNETI-Token": token,
        "X-UNETI-Client-IP": ip,
      },
      body: JSON.stringify(datos),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    const cuerpo = (await respuesta.json().catch(() => null)) as
      | { ok?: boolean; folio?: string; ticket?: string; id?: number; message?: string }
      | null;

    if (!respuesta.ok) {
      console.error("[solicitudes] WordPress respondió", respuesta.status);
      return {
        ok: false,
        status: respuesta.status >= 500 ? 502 : respuesta.status,
        error:
          respuesta.status === 403
            ? "La solicitud no pudo autenticarse con el gestor de contenido."
            : "No pudimos registrar la solicitud.",
      };
    }

    return {
      ok: true,
      status: 201,
      folio: cuerpo?.folio ?? cuerpo?.ticket,
      id: cuerpo?.id,
    };
  } catch (error) {
    console.error("[solicitudes] No se pudo contactar a WordPress", error);
    return {
      ok: false,
      status: 503,
      error: "El servicio de solicitudes no está disponible. Inténtalo más tarde.",
    };
  }
}
