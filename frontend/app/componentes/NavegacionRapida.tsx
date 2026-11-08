"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  PAGINAS_RAPIDAS,
  seccionesParaRuta,
} from "../lib/navegacion-rapida";

/**
 * Hamburguesa de navegación rápida, disponible en todas las rutas.
 *
 * En escritorio abre un panel lateral; en móvil, una hoja inferior. La lista de
 * secciones se resuelve en el cliente para no depender de qué anclas existan en
 * cada página y para no alterar el HTML del servidor (sin errores de hidratación).
 */
export default function NavegacionRapida() {
  const pathname = usePathname();
  const [rutaPanel, setRutaPanel] = useState<string | null>(null);
  const [activa, setActiva] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);

  const secciones = useMemo(() => seccionesParaRuta(pathname), [pathname]);
  /** El panel solo está abierto si se abrió en la ruta actual. */
  const abierto = rutaPanel === pathname;

  const cerrar = () => setRutaPanel(null);
  const alternar = () => setRutaPanel(abierto ? null : pathname);

  const estaActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Al cambiar de ruta el panel se cierra (estado diferido, fuera del cuerpo del efecto).
  useEffect(() => {
    const temporizador = window.setTimeout(() => setRutaPanel(null), 0);
    return () => window.clearTimeout(temporizador);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return;

    const foco = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-primer-enlace]")?.focus();
    }, 90);

    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const alPresionar = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setRutaPanel(null);
      botonRef.current?.focus();
    };

    document.addEventListener("keydown", alPresionar);

    return () => {
      window.clearTimeout(foco);
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", alPresionar);
    };
  }, [abierto]);

  useEffect(() => {
    if (!abierto || secciones.length === 0) return;

    const calcular = () => {
      const limite = window.innerHeight * 0.35;
      let actual = secciones[0]?.id ?? "";

      for (const seccion of secciones) {
        const elemento = document.getElementById(seccion.id);
        if (elemento && elemento.getBoundingClientRect().top <= limite) actual = seccion.id;
      }

      setActiva(actual);
    };

    const frame = window.requestAnimationFrame(calcular);
    window.addEventListener("scroll", calcular, { passive: true });
    window.addEventListener("resize", calcular);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", calcular);
      window.removeEventListener("resize", calcular);
    };
  }, [abierto, secciones]);

  const irASeccion = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    cerrar();

    window.setTimeout(() => {
      const elemento = document.getElementById(id);
      if (!elemento) return;

      const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      elemento.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }, 140);
  };

  const volverArriba = () => {
    cerrar();
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
  };

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        className={`uneti-quicknav__fab${abierto ? " is-open" : ""}`}
        aria-expanded={abierto}
        aria-controls="uneti-quicknav-panel"
        aria-label={abierto ? "Cerrar navegación rápida" : "Abrir navegación rápida"}
        onClick={alternar}
      >
        <span className="uneti-quicknav__burger" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span className="uneti-quicknav__fab-texto">Índice</span>
      </button>

      <div
        className={`uneti-quicknav__overlay${abierto ? " is-open" : ""}`}
        onClick={cerrar}
        aria-hidden="true"
      ></div>

      <aside
        id="uneti-quicknav-panel"
        ref={panelRef}
        className={`uneti-quicknav__panel${abierto ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navegación rápida por la página"
        aria-hidden={!abierto}
        inert={!abierto}
      >
        <header className="uneti-quicknav__head">
          <div>
            <span className="uneti-quicknav__sello">UNETI</span>
            <strong>Navegación rápida</strong>
          </div>
          <button
            type="button"
            className="uneti-quicknav__cerrar"
            onClick={cerrar}
            aria-label="Cerrar navegación rápida"
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        {secciones.length > 0 && (
          <nav className="uneti-quicknav__grupo" aria-label="Secciones de esta página">
            <span className="uneti-quicknav__titulo">En esta página</span>
            <ol className="uneti-quicknav__lista">
              {secciones.map((seccion, indice) => (
                <li key={seccion.id}>
                  <a
                    href={`#${seccion.id}`}
                    onClick={irASeccion(seccion.id)}
                    className={activa === seccion.id ? "is-active" : ""}
                    aria-current={activa === seccion.id ? "true" : undefined}
                    data-primer-enlace={indice === 0 ? "true" : undefined}
                  >
                    <span className="uneti-quicknav__num" aria-hidden="true">
                      {String(indice + 1).padStart(2, "0")}
                    </span>
                    <i className={seccion.icono} aria-hidden="true"></i>
                    <span>{seccion.etiqueta}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <nav className="uneti-quicknav__grupo" aria-label="Páginas del sitio">
          <span className="uneti-quicknav__titulo">Páginas</span>
          <div className="uneti-quicknav__paginas">
            {PAGINAS_RAPIDAS.map((pagina) => (
              <a
                key={pagina.href}
                href={pagina.href}
                className={estaActivo(pagina.href) ? "is-active" : ""}
                aria-current={estaActivo(pagina.href) ? "page" : undefined}
                onClick={cerrar}
                data-primer-enlace={
                  secciones.length === 0 && pagina.href === "/" ? "true" : undefined
                }
              >
                <i className={pagina.icono} aria-hidden="true"></i>
                <span>{pagina.etiqueta}</span>
              </a>
            ))}
          </div>
        </nav>

        <footer className="uneti-quicknav__foot">
          <button type="button" className="uneti-quicknav__arriba" onClick={volverArriba}>
            <i className="bi bi-arrow-up" aria-hidden="true"></i>
            Volver arriba
          </button>
        </footer>
      </aside>
    </>
  );
}
