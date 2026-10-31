import { isIP } from "node:net";

type Balde = {
  conteo: number;
  reinicio: number;
};

const BALDES = new Map<string, Balde>();

/** Limita peticiones por clave dentro de una ventana deslizante sencilla. */
export function limitar(clave: string, maximo: number, ventanaMs: number) {
  const ahora = Date.now();
  const actual = BALDES.get(clave);

  if (BALDES.size > 5000) {
    for (const [indice, balde] of BALDES) {
      if (balde.reinicio <= ahora) BALDES.delete(indice);
    }
  }

  if (!actual || actual.reinicio <= ahora) {
    const nuevo = { conteo: 1, reinicio: ahora + ventanaMs };
    BALDES.set(clave, nuevo);
    return { permitido: true, restante: maximo - 1, reinicio: nuevo.reinicio };
  }

  if (actual.conteo >= maximo) {
    return { permitido: false, restante: 0, reinicio: actual.reinicio };
  }

  actual.conteo += 1;
  return {
    permitido: true,
    restante: Math.max(0, maximo - actual.conteo),
    reinicio: actual.reinicio,
  };
}

/** Obtiene la IP del cliente respetando el proxy inverso de Next.js/Docker. */
export function obtenerIp(request: Request): string {
  const reenviada = request.headers.get("x-forwarded-for");
  if (reenviada) {
    const primera = reenviada.split(",")[0]?.trim();
    if (primera && isIP(primera)) return primera;
  }

  const real = request.headers.get("x-real-ip")?.trim();
  if (real && isIP(real)) return real;

  return "127.0.0.1";
}

/**
 * Rechaza peticiones de navegador con un Origin distinto al sitio público.
 * Las llamadas sin Origin (curl, pruebas internas) se permiten porque el
 * endpoint solo crea solicitudes y está protegido por token en WordPress.
 */
export function origenValido(request: Request): boolean {
  const origen = request.headers.get("origin");
  if (!origen) return true;

  const sitio = process.env.NEXT_PUBLIC_SITE_URL;
  if (!sitio) return true;

  try {
    return new URL(origen).origin === new URL(sitio).origin;
  } catch {
    return false;
  }
}
