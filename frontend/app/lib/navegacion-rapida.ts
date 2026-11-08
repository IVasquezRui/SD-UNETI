import { POSGRADOS } from "./posgrados";

export type SeccionRapida = {
  id: string;
  etiqueta: string;
  icono: string;
};

export type PaginaRapida = {
  href: string;
  etiqueta: string;
  icono: string;
};

/** Páginas principales para el panel de navegación rápida. */
export const PAGINAS_RAPIDAS: PaginaRapida[] = [
  { href: "/", etiqueta: "Inicio", icono: "bi bi-house-door" },
  { href: "/nosotros", etiqueta: "Nosotros", icono: "bi bi-people" },
  { href: "/carreras", etiqueta: "Carreras", icono: "bi bi-mortarboard" },
  { href: "/posgrados", etiqueta: "Posgrados", icono: "bi bi-award" },
  { href: "/cursos", etiqueta: "Cursos", icono: "bi bi-journal-code" },
  { href: "/noticias", etiqueta: "Noticias", icono: "bi bi-newspaper" },
  { href: "/admisiones", etiqueta: "Admisiones", icono: "bi bi-clipboard-check" },
  { href: "/contacto", etiqueta: "Contacto", icono: "bi bi-envelope" },
];

const DETALLE_CARRERA: SeccionRapida[] = [
  { id: "presentacion", etiqueta: "Presentación", icono: "bi bi-file-text" },
  { id: "galeria", etiqueta: "Galería", icono: "bi bi-images" },
  { id: "fundamentos", etiqueta: "Fundamentos", icono: "bi bi-compass" },
  { id: "campo-laboral", etiqueta: "Campo laboral", icono: "bi bi-briefcase" },
  { id: "malla", etiqueta: "Plan de estudios", icono: "bi bi-diagram-3" },
  { id: "laboratorios", etiqueta: "Laboratorios", icono: "bi bi-tools" },
  { id: "salidas", etiqueta: "Salidas profesionales", icono: "bi bi-signpost-split" },
  { id: "preguntas", etiqueta: "Preguntas frecuentes", icono: "bi bi-question-circle" },
  { id: "admision", etiqueta: "Inicia tu admisión", icono: "bi bi-clipboard-check" },
];

const DETALLE_NOTICIA: SeccionRapida[] = [
  { id: "contenido", etiqueta: "Contenido", icono: "bi bi-file-text" },
  { id: "autor", etiqueta: "Autor", icono: "bi bi-person-badge" },
  { id: "comentarios", etiqueta: "Comentarios", icono: "bi bi-chat-square-text" },
  { id: "relacionadas", etiqueta: "Noticias relacionadas", icono: "bi bi-newspaper" },
];

/** Secciones de cada ruta, en el orden en que aparecen en la página. */
export const SECCIONES_RAPIDAS: Record<string, SeccionRapida[]> = {
  "/": [
    { id: "hero", etiqueta: "Portada", icono: "bi bi-house-door" },
    { id: "about", etiqueta: "Somos UNETI", icono: "bi bi-people" },
    { id: "programas", etiqueta: "Programas (PNF)", icono: "bi bi-mortarboard" },
    { id: "preguntas", etiqueta: "Preguntas frecuentes", icono: "bi bi-question-circle" },
    { id: "actividades", etiqueta: "Vida universitaria", icono: "bi bi-calendar-event" },
    { id: "testimonials", etiqueta: "Testimonios", icono: "bi bi-chat-quote" },
    { id: "articulos", etiqueta: "Noticias", icono: "bi bi-newspaper" },
  ],
  "/nosotros": [
    { id: "somos", etiqueta: "Somos UNETI", icono: "bi bi-people" },
    { id: "nuestra-historia", etiqueta: "Nuestra historia", icono: "bi bi-hourglass-split" },
    { id: "esencia", etiqueta: "Nuestra esencia", icono: "bi bi-gem" },
    { id: "tu-ruta", etiqueta: "Tu ruta en la UNETI", icono: "bi bi-signpost-split" },
    { id: "modalidad", etiqueta: "Cómo se estudia", icono: "bi bi-laptop" },
    { id: "sedes", etiqueta: "Sedes", icono: "bi bi-geo-alt" },
    { id: "comunidad", etiqueta: "Comunidad UNETI", icono: "bi bi-stars" },
    { id: "institucional", etiqueta: "Misión y visión", icono: "bi bi-bank" },
    { id: "actividades", etiqueta: "Actividades", icono: "bi bi-calendar-event" },
    { id: "unete", etiqueta: "Forma parte", icono: "bi bi-clipboard-check" },
  ],
  "/carreras": [
    { id: "oferta", etiqueta: "Oferta académica", icono: "bi bi-mortarboard" },
    { id: "ventajas", etiqueta: "Ventajas", icono: "bi bi-stars" },
    { id: "posgrados", etiqueta: "Posgrados", icono: "bi bi-award" },
  ],
  "/posgrados": [
    { id: "oferta", etiqueta: "Oferta de posgrados", icono: "bi bi-award" },
    ...POSGRADOS.map((posgrado) => ({
      id: posgrado.slug,
      etiqueta: posgrado.nombre,
      icono: posgrado.icono,
    })),
    { id: "requisitos", etiqueta: "Requisitos", icono: "bi bi-list-check" },
    { id: "formulario-posgrados", etiqueta: "Solicitud en línea", icono: "bi bi-send" },
  ],
  "/cursos": [
    { id: "cursos", etiqueta: "Cursos disponibles", icono: "bi bi-journal-code" },
    { id: "como-participar", etiqueta: "Cómo participar", icono: "bi bi-list-ol" },
  ],
  "/noticias": [{ id: "listado", etiqueta: "Últimas noticias", icono: "bi bi-newspaper" }],
  "/admisiones": [
    { id: "proceso", etiqueta: "Proceso de admisión", icono: "bi bi-list-ol" },
    { id: "formulario", etiqueta: "Solicitud en línea", icono: "bi bi-send" },
  ],
  "/contacto": [
    { id: "sede-administrativa", etiqueta: "Sede Administrativa", icono: "bi bi-geo-alt" },
    { id: "nucleo-cantv", etiqueta: "Núcleo CANTV", icono: "bi bi-geo-alt" },
    { id: "canales", etiqueta: "Canales de atención", icono: "bi bi-headset" },
    { id: "formulario-contacto", etiqueta: "Envíanos un mensaje", icono: "bi bi-send" },
  ],
};

/** Devuelve las secciones rápidas de la ruta actual. */
export function seccionesParaRuta(pathname: string): SeccionRapida[] {
  if (SECCIONES_RAPIDAS[pathname]) return SECCIONES_RAPIDAS[pathname];
  if (pathname.startsWith("/carreras/")) return DETALLE_CARRERA;
  if (pathname.startsWith("/noticias/")) return DETALLE_NOTICIA;
  return [];
}
