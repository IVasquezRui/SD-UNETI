"use client";

import {
  Children,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type PropiedadesCarruselFundido = {
  children: ReactNode;
  label: string;
  className?: string;
  autoPlay?: boolean;
  intervalo?: number;
};

/**
 * Carrusel de imágenes con transición de fundido.
 *
 * El HTML del servidor siempre muestra la primera imagen; el avance automático
 * se activa después de hidratar y se pausa al pasar el mouse o al reducir el
 * movimiento. Los indicadores viven fuera del enlace de la tarjeta.
 */
export default function CarruselFundido({
  children,
  label,
  className = "",
  autoPlay = true,
  intervalo = 5000,
}: PropiedadesCarruselFundido) {
  const diapositivas = Children.toArray(children);
  const total = diapositivas.length;
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (!autoPlay || pausado || total <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const temporizador = window.setInterval(() => {
      setActivo((indice) => (indice + 1) % total);
    }, intervalo);

    return () => window.clearInterval(temporizador);
  }, [autoPlay, intervalo, pausado, total]);

  const irA = (indice: number) => {
    if (total === 0) return;
    setActivo((indice + total) % total);
  };

  return (
    <div
      className={`uneti-fundido ${className}`.trim()}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) {
          setPausado(false);
        }
      }}
    >
      <div className="uneti-fundido__viewport">
        {diapositivas.map((diapositiva, indice) => (
          <div
            className={`uneti-fundido__slide${indice === activo ? " is-active" : ""}`}
            key={indice}
            aria-hidden={indice !== activo}
          >
            {diapositiva}
          </div>
        ))}
      </div>

      {total > 1 && (
        <div className="uneti-fundido__dots">
          {diapositivas.map((_, indice) => (
            <button
              type="button"
              key={indice}
              className={`uneti-fundido__dot${indice === activo ? " is-active" : ""}`}
              onClick={() => irA(indice)}
              aria-label={`Ir a la imagen ${indice + 1}`}
              aria-current={indice === activo ? "true" : undefined}
            />
          ))}
        </div>
      )}

      <p className="visually-hidden" aria-live="polite">
        {total > 0 ? `Imagen ${activo + 1} de ${total}` : ""}
      </p>
    </div>
  );
}
