"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type DiapositivaHero = {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  width: number;
  height: number;
  /** Encuadre de la imagen; por defecto conserva el encuadre histórico del hero. */
  posicion?: string;
};

type PropiedadesMediaHero = {
  slides: DiapositivaHero[];
  velocidad?: number;
  intervalo?: number;
};

/**
 * Fondo del hero con parallax de scroll y carrusel de imágenes.
 *
 * La primera diapositiva se renderiza desde el servidor; el desplazamiento y
 * el avance automático se aplican en el cliente sobre variables CSS y estado,
 * sin alterar el HTML inicial ni provocar errores de hidratación. Se desactiva
 * el parallax en móvil y con movimiento reducido.
 */
export default function MediaHeroParallax({
  slides,
  velocidad = 0.1,
  intervalo = 5000,
}: PropiedadesMediaHero) {
  const capa = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = slides.length;

  useEffect(() => {
    if (total <= 1 || pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const temporizador = window.setInterval(() => {
      setActivo((indice) => (indice + 1) % total);
    }, intervalo);

    return () => window.clearInterval(temporizador);
  }, [intervalo, pausado, total]);

  // Pausa el carrusel cuando el puntero entra al hero completo (no solo a la capa).
  useEffect(() => {
    const hero = capa.current?.closest(".uneti-hero");
    if (!hero) return;

    const pausar = () => setPausado(true);
    const reanudar = () => setPausado(false);

    hero.addEventListener("mouseenter", pausar);
    hero.addEventListener("mouseleave", reanudar);

    return () => {
      hero.removeEventListener("mouseenter", pausar);
      hero.removeEventListener("mouseleave", reanudar);
    };
  }, []);

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
    <>
      <div ref={capa} className="uneti-hero__media-wrap">
        {slides.map((slide, indice) => (
          <picture
            key={slide.desktopSrc}
            className={`uneti-hero__slide${indice === activo ? " is-active" : ""}`}
          >
            {slide.mobileSrc && <source media="(max-width: 767.98px)" srcSet={slide.mobileSrc} />}
            <img
              src={slide.desktopSrc}
              alt={indice === activo ? slide.alt : ""}
              className="uneti-hero__media"
              style={
                { "--hero-object-position": slide.posicion ?? "50% 32%" } as CSSProperties
              }
              width={slide.width}
              height={slide.height}
              loading={indice === 0 ? "eager" : "lazy"}
              fetchPriority={indice === 0 ? "high" : "auto"}
              decoding="async"
            />
          </picture>
        ))}
      </div>

      {total > 1 && (
        <div className="uneti-hero__dots" role="tablist" aria-label="Imágenes de portada">
          {slides.map((slide, indice) => (
            <button
              key={slide.desktopSrc}
              type="button"
              role="tab"
              aria-selected={indice === activo}
              aria-label={`Mostrar imagen ${indice + 1}`}
              className={`uneti-hero__dot${indice === activo ? " is-active" : ""}`}
              onClick={() => setActivo(indice)}
            />
          ))}
        </div>
      )}
    </>
  );
}
