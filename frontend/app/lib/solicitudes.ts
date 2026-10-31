/** Contrato compartido por el formulario de admisiones y el de contacto. */

export const PROGRAMAS_ADMISION = [
  "PNF en Telecomunicaciones",
  "PNF en Informática",
] as const;

export type TipoSolicitud = "admision" | "contacto";

export type SolicitudPayload = {
  tipo: TipoSolicitud;
  nombre: string;
  cedula?: string;
  correo: string;
  telefono: string;
  programa?: string;
  asunto?: string;
  mensaje?: string;
  consentimiento: boolean;
  origen?: string;
  inicio?: number;
  sitio_web?: string;
};

export type ResultadoValidacion = {
  valido: boolean;
  errores: Record<string, string>;
  datos?: SolicitudPayload;
};

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_TELEFONO = /^[+()\d\s.-]+$/;
const PATRON_CEDULA = /^\d{5,10}$/;

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

function numero(valor: unknown): number | undefined {
  if (typeof valor === "number" && Number.isFinite(valor)) return valor;
  if (typeof valor === "string" && valor.trim() !== "") {
    const convertido = Number(valor);
    if (Number.isFinite(convertido)) return convertido;
  }
  return undefined;
}

/**
 * Valida y normaliza el payload antes de enviarlo a WordPress.
 * La misma función se usa en el cliente para mostrar errores por campo.
 */
export function validarSolicitud(
  payload: unknown,
  tipoEsperado?: TipoSolicitud,
): ResultadoValidacion {
  const errores: Record<string, string> = {};
  const entrada = (payload ?? {}) as Record<string, unknown>;
  const tipoCrudo = texto(entrada.tipo);
  const tipo = (tipoEsperado ?? tipoCrudo) as TipoSolicitud;

  if (tipo !== "admision" && tipo !== "contacto") {
    errores.tipo = "El tipo de solicitud no es válido.";
  }

  if (tipoEsperado && tipoCrudo && tipoCrudo !== tipoEsperado) {
    errores.tipo = "El tipo de solicitud no coincide con esta ruta.";
  }

  const nombre = texto(entrada.nombre);
  if (nombre.length < 2 || nombre.length > 120) {
    errores.nombre = "Escribe un nombre de entre 2 y 120 caracteres.";
  }

  const correo = texto(entrada.correo).toLowerCase();
  if (!PATRON_CORREO.test(correo) || correo.length > 160) {
    errores.correo = "Escribe un correo electrónico válido.";
  }

  const telefonoCrudo = texto(entrada.telefono);
  const telefonoDigitos = telefonoCrudo.replace(/\D/g, "");
  if (
    !PATRON_TELEFONO.test(telefonoCrudo) ||
    telefonoDigitos.length < 7 ||
    telefonoDigitos.length > 15
  ) {
    errores.telefono = "Escribe un teléfono válido de entre 7 y 15 dígitos.";
  }

  let cedula: string | undefined;
  const cedulaCruda = texto(entrada.cedula).replace(/[.\s-]/g, "");
  if (cedulaCruda !== "") {
    if (!PATRON_CEDULA.test(cedulaCruda)) {
      errores.cedula = "La cédula debe tener entre 5 y 10 dígitos.";
    } else {
      cedula = cedulaCruda;
    }
  } else if (tipo === "admision") {
    errores.cedula = "La cédula es obligatoria para la solicitud de admisión.";
  }

  let programa: string | undefined;
  const programaCrudo = texto(entrada.programa);
  if (programaCrudo !== "") {
    if (!PROGRAMAS_ADMISION.includes(programaCrudo as (typeof PROGRAMAS_ADMISION)[number])) {
      errores.programa = "Selecciona uno de los PNF disponibles.";
    } else {
      programa = programaCrudo;
    }
  } else if (tipo === "admision") {
    errores.programa = "Selecciona el PNF de tu interés.";
  }

  const asunto = texto(entrada.asunto);
  if (asunto.length > 160) {
    errores.asunto = "El asunto no puede superar los 160 caracteres.";
  }

  const mensaje = texto(entrada.mensaje);
  if (mensaje.length > 2000) {
    errores.mensaje = "El mensaje no puede superar los 2000 caracteres.";
  }

  const consentimiento =
    entrada.consentimiento === true ||
    entrada.consentimiento === "true" ||
    entrada.consentimiento === "on" ||
    entrada.consentimiento === "1";
  if (!consentimiento) {
    errores.consentimiento = "Debes autorizar el tratamiento de tus datos.";
  }

  if (texto(entrada.sitio_web) !== "") {
    errores.sitio_web = "La solicitud no es válida.";
  }

  const inicio = numero(entrada.inicio);
  if (inicio !== undefined && Date.now() - inicio < 2500) {
    errores.inicio = "La solicitud se envió demasiado rápido. Inténtalo de nuevo.";
  }

  const origenCrudo = texto(entrada.origen);
  let origen: string | undefined;
  if (origenCrudo !== "") {
    try {
      const url = new URL(origenCrudo);
      if (url.protocol === "http:" || url.protocol === "https:") {
        origen = url.toString().slice(0, 300);
      }
    } catch {
      origen = undefined;
    }
  }

  if (Object.keys(errores).length > 0) {
    return { valido: false, errores };
  }

  return {
    valido: true,
    errores,
    datos: {
      tipo,
      nombre,
      cedula,
      correo,
      telefono: telefonoCrudo,
      programa,
      asunto: asunto || undefined,
      mensaje: mensaje || undefined,
      consentimiento,
      origen,
      inicio,
    },
  };
}
