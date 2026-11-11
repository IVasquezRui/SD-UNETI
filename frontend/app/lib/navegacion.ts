export type ElementoNavegacion = {
  etiqueta: string;
  href: string;
};

/** Navegación principal: usada por EncabezadoSitio en todas las rutas. */
export const NAVEGACION_PRINCIPAL: ElementoNavegacion[] = [
  { etiqueta: "Inicio", href: "/" },
  { etiqueta: "Nosotros", href: "/nosotros" },
  { etiqueta: "Carreras", href: "/carreras" },
  { etiqueta: "Postgrados", href: "/posgrados" },
  { etiqueta: "Cursos", href: "/cursos" },
  { etiqueta: "Noticias", href: "/noticias" },
  { etiqueta: "Admisiones", href: "/admisiones" },
  { etiqueta: "Contacto", href: "/contacto#formulario-contacto" },
];

/** Navegación inferior del pie de página. */
export const NAVEGACION_PIE: ElementoNavegacion[] = [
  { etiqueta: "Inicio", href: "/" },
  { etiqueta: "Nosotros", href: "/nosotros" },
  { etiqueta: "Carreras", href: "/carreras" },
  { etiqueta: "Postgrados", href: "/posgrados" },
  { etiqueta: "Cursos", href: "/cursos" },
  { etiqueta: "Noticias", href: "/noticias" },
  { etiqueta: "Admisiones", href: "/admisiones" },
  { etiqueta: "Contacto", href: "/contacto#formulario-contacto" },
];
