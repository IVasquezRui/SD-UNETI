"use client";

import { useEffect, type RefObject } from "react";

type OpcionesParallax = {
  velocidad?: number;
  anchoMinimo?: number;
  /**
   * Selector del ancestro que define el recorrido del parallax.
   * Por defecto se mide el padre directo; en bloques con `position: sticky`
   * hay que apuntar a la sección que sí se desplaza (si no, el progreso queda
   * congelado y la imagen no se mueve).
   */
  alcanceSelector?: string;
};

/**
 * Desplaza suavemente un nodo dentro de su contenedor al hacer scroll.
 *
 * - Solo se activa en escritorio y sin `prefers-reduced-motion`.
 * - Escucha el scroll con `requestAnimationFrame` y se apaga cuando el bloque
 *   sale del viewport.
 * - Escribe la variable CSS `--parallax-y`, que el CSS convierte en transform.
 */
export function useParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { velocidad = 0.08, anchoMinimo = 768, alcanceSelector }: OpcionesParallax = {},
) {
  useEffect(() => {
    const nodo = ref.current;
    const alcance =
      (alcanceSelector
        ? (nodo?.closest(alcanceSelector) as HTMLElement | null)
        : null) ?? nodo?.parentElement;
    if (!nodo || !alcance) return;

    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const escritorio = window.matchMedia(`(min-width: ${anchoMinimo}px)`);

    let frame = 0;
    let visible = false;
    let activo = false;

    const aplicar = () => {
      frame = 0;
      if (!activo || !visible) return;

      const rect = alcance.getBoundingClientRect();
      const altoVentana = window.innerHeight;
      if (rect.bottom < -120 || rect.top > altoVentana + 120) return;

      const progreso =
        (rect.top + rect.height / 2 - altoVentana / 2) / (altoVentana / 2 + rect.height / 2);
      const limitado = Math.max(-1, Math.min(1, progreso));
      const desplazamiento = limitado * velocidad * Math.min(rect.height, 900);

      nodo.style.setProperty("--parallax-y", `${desplazamiento.toFixed(2)}px`);
    };

    const programar = () => {
      if (!activo || !visible || frame) return;
      frame = window.requestAnimationFrame(aplicar);
    };

    const actualizarModo = () => {
      activo = escritorio.matches && !movimientoReducido.matches;

      if (!activo) {
        nodo.style.removeProperty("--parallax-y");
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        return;
      }

      programar();
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entradas) => {
              visible = entradas.some((entrada) => entrada.isIntersecting);
              if (visible) programar();
            },
            { rootMargin: "20% 0px" },
          )
        : null;

    observer?.observe(alcance);
    actualizarModo();

    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar, { passive: true });
    escritorio.addEventListener("change", actualizarModo);
    movimientoReducido.addEventListener("change", actualizarModo);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
      escritorio.removeEventListener("change", actualizarModo);
      movimientoReducido.removeEventListener("change", actualizarModo);
      if (frame) window.cancelAnimationFrame(frame);
      nodo.style.removeProperty("--parallax-y");
    };
  }, [ref, velocidad, anchoMinimo, alcanceSelector]);
}
