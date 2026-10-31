"use client";

import { useEffect, useRef } from "react";

type PropiedadesMediaHero = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  width: number;
  height: number;
  velocidad?: number;
};

/**
 * Fondo del hero con parallax tradicional de scroll.
 *
 * La imagen se renderiza desde el servidor; el desplazamiento se aplica en el
 * cliente sobre una variable CSS para no alterar el HTML inicial ni provocar
 * errores de hidratación. Se desactiva en móvil y con movimiento reducido.
 */
export default function MediaHeroParallax({
  desktopSrc,
  mobileSrc,
  alt,
  width,
  height,
  velocidad = 0.1,
}: PropiedadesMediaHero) {
  const capa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = capa.current;
    const hero = nodo?.closest(".uneti-hero");
    if (!nodo || !hero) return;

    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const escritorio = window.matchMedia("(min-width: 768px)");

    let frame = 0;
    let activo = false;

    const aplicar = () => {
      frame = 0;
      if (!activo) return;

      const rect = hero.getBoundingClientRect();
      const altoVentana = window.innerHeight;
      if (rect.bottom < 0 || rect.top > altoVentana) return;

      const progreso =
        (rect.top + rect.height / 2 - altoVentana / 2) / (altoVentana / 2 + rect.height / 2);
      const limitado = Math.max(-1, Math.min(1, progreso));
      const desplazamiento = limitado * velocidad * rect.height;

      nodo.style.setProperty("--hero-parallax", `${desplazamiento.toFixed(2)}px`);
    };

    const programar = () => {
      if (!activo || frame) return;
      frame = window.requestAnimationFrame(aplicar);
    };

    const actualizarModo = () => {
      activo = escritorio.matches && !movimientoReducido.matches;

      if (!activo) {
        nodo.style.removeProperty("--hero-parallax");
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        return;
      }

      programar();
    };

    actualizarModo();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar, { passive: true });
    escritorio.addEventListener("change", actualizarModo);
    movimientoReducido.addEventListener("change", actualizarModo);

    return () => {
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
      escritorio.removeEventListener("change", actualizarModo);
      movimientoReducido.removeEventListener("change", actualizarModo);
      if (frame) window.cancelAnimationFrame(frame);
      nodo.style.removeProperty("--hero-parallax");
    };
  }, [velocidad]);

  return (
    <div ref={capa} className="uneti-hero__media-wrap">
      <picture>
        <source media="(max-width: 767.98px)" srcSet={mobileSrc} />
        <img
          src={desktopSrc}
          alt={alt}
          className="uneti-hero__media"
          width={width}
          height={height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
    </div>
  );
}
