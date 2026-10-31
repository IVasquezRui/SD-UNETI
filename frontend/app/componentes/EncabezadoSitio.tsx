"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONTACTO } from "../lib/institucional";
import { NAVEGACION_PRINCIPAL } from "../lib/navegacion";
import LogotipoSitio from "./LogotipoSitio";

export default function EncabezadoSitio() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [desplazado, setDesplazado] = useState(false);

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 12);
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  useEffect(() => {
    if (!menuAbierto) return;

    const alPresionarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuAbierto(false);
    };

    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [menuAbierto]);

  const esActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`uneti-header${desplazado ? " is-scrolled" : ""}`}>
      <nav className="navbar navbar-expand-lg uneti-header__nav" aria-label="Navegación principal">
        <div className="container">
          <a className="navbar-brand uneti-header__brand" href="/" aria-label="UNETI, ir al inicio">
            <LogotipoSitio variant="dark" />
          </a>

          <button
            className="navbar-toggler uneti-header__toggler"
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-controls="navbarNav"
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? "Cerrar navegación" : "Abrir navegación"}
          >
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
            <span className="navbar-toggler-line"></span>
          </button>

          <div
            className={`collapse navbar-collapse uneti-header__menu${menuAbierto ? " show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav alt-font mx-auto">
              {NAVEGACION_PRINCIPAL.map((item) => (
                <li className="nav-item" key={item.href}>
                  <a
                    href={item.href}
                    className={`nav-link${esActivo(item.href) ? " active" : ""}`}
                    aria-current={esActivo(item.href) ? "page" : undefined}
                    onClick={() => setMenuAbierto(false)}
                  >
                    {item.etiqueta}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={CONTACTO.campus}
              className="uneti-header__campus"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuAbierto(false)}
            >
              Ir al Campus Virtual
              <i className="bi bi-arrow-up-right ms-2" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

