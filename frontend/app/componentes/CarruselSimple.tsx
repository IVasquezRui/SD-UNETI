"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from "react";

type PropiedadesCarrusel = {
  children: ReactNode;
  label: string;
  className?: string;
  autoPlay?: boolean;
  intervalo?: number;
};

export default function CarruselSimple({
  children,
  label,
  className = "",
  autoPlay = false,
  intervalo = 6500,
}: PropiedadesCarrusel) {
  const diapositivas = Children.toArray(children);
  const total = diapositivas.length;
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const inicioTactil = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || pausado || total <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActivo((indice) => (indice + 1) % total);
    }, intervalo);

    return () => window.clearInterval(timer);
  }, [autoPlay, intervalo, pausado, total]);

  const irA = (indice: number) => {
    if (total === 0) return;
    setActivo((indice + total) % total);
  };

  const alPresionarTecla = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      irA(activo - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      irA(activo + 1);
    }
  };

  const alTocarInicio = (event: TouchEvent<HTMLDivElement>) => {
    inicioTactil.current = event.touches[0]?.clientX ?? null;
  };

  const alTocarFin = (event: TouchEvent<HTMLDivElement>) => {
    if (inicioTactil.current === null) return;
    const fin = event.changedTouches[0]?.clientX ?? inicioTactil.current;
    const distancia = fin - inicioTactil.current;
    inicioTactil.current = null;

    if (Math.abs(distancia) < 45) return;
    irA(distancia > 0 ? activo - 1 : activo + 1);
  };

  return (
    <div
      className={`uneti-carousel ${className}`.trim()}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={alPresionarTecla}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPausado(false);
        }
      }}
    >
      <div
        className="uneti-carousel-viewport"
        onTouchStart={alTocarInicio}
        onTouchEnd={alTocarFin}
      >
        <div
          className="uneti-carousel-track"
          style={{ transform: `translate3d(-${activo * 100}%, 0, 0)` }}
        >
          {diapositivas.map((diapositiva, indice) => (
            <div
              className="uneti-carousel-slide"
              key={indice}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${indice + 1} de ${total}`}
              aria-hidden={indice !== activo}
            >
              {diapositiva}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="uneti-carousel-controls">
          <button
            type="button"
            className="uneti-carousel-arrow"
            onClick={() => irA(activo - 1)}
            aria-label="Diapositiva anterior"
          >
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
          </button>

          <div className="uneti-carousel-dots">
            {diapositivas.map((_, indice) => (
              <button
                type="button"
                key={indice}
                className={`uneti-carousel-dot${indice === activo ? " is-active" : ""}`}
                onClick={() => irA(indice)}
                aria-label={`Ir a la diapositiva ${indice + 1}`}
                aria-current={indice === activo ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            className="uneti-carousel-arrow"
            onClick={() => irA(activo + 1)}
            aria-label="Diapositiva siguiente"
          >
            <i className="bi bi-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      )}

      <p className="visually-hidden" aria-live="polite">
        {total > 0 ? `Diapositiva ${activo + 1} de ${total}` : ""}
      </p>
    </div>
  );
}
