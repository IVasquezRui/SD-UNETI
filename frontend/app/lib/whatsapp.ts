/** Enlaces de contacto por WhatsApp (número oficial de atención de la UNETI). */

export const WHATSAPP_NUMERO = "584241427051";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}`;

/**
 * Construye un enlace de WhatsApp con el mensaje precargado.
 * Se usa en el cliente y en el servidor: no depende del DOM.
 */
export function enlaceWhatsApp(mensaje: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeCurso(titulo: string): string {
  return `Hola UNETI, quiero saber más información al respecto de los cursos: ${titulo}`;
}

export function mensajePosgrado(nombre: string): string {
  return `Hola UNETI, quiero solicitar información sobre el posgrado: ${nombre}`;
}

export function mensajeCursos(): string {
  return "Hola, UNETI. Quiero saber más información sobre los cursos que ustedes dan.";
}
