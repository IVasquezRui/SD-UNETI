export type NavItem = {
  label: string;
  href: string;
};

/** Navegación principal: usada por SiteHeader en todas las rutas. */
export const MAIN_NAV: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Sobre Nosotros", href: "/about" },
  { label: "Carreras", href: "/courses" },
  { label: "Noticias", href: "/news" },
  { label: "Contacto", href: "/contact" },
];

/** Navegación inferior del footer. */
export const FOOTER_NAV: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Sobre Nosotros", href: "/about" },
  { label: "Carreras", href: "/courses" },
  { label: "Noticias", href: "/news" },
  { label: "Contacto", href: "/contact" },
];

