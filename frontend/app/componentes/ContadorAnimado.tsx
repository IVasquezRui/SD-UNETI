"use client";

import { useEffect, useRef } from "react";

const FORMATO = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 0 });

type PropiedadesContador = {
  valor: number;
  sufijo?: string;
  prefijo?: string;
  duracion?: number;
  className?: string;
};

/**
 * Contador accesible y sin dependencias.
 *
 * El servidor entrega el valor final (bueno para SEO y para usuarios sin JS).
 * Al hidratar, si el bloque entra en el viewport, se anima con rAF.
 */
export default function ContadorAnimado({
  valor,
  sufijo = "",
  prefijo = "",
  duracion = 1500,
  className = "",
}: PropiedadesContador) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefiereMovimientoReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefiereMovimientoReducido || typeof IntersectionObserver === "undefined") {
      node.textContent = `${prefijo}${FORMATO.format(valor)}${sufijo}`;
      return;
    }

    let frame = 0;
    let iniciado = false;

    const escribir = (numero: number) => {
      node.textContent = `${prefijo}${FORMATO.format(numero)}${sufijo}`;
    };

    const animar = () => {
      if (iniciado) return;
      iniciado = true;
      escribir(0);
      const inicio = performance.now();

      const paso = (ahora: number) => {
        const avance = Math.min((ahora - inicio) / duracion, 1);
        const suavizado = 1 - Math.pow(1 - avance, 3);
        escribir(Math.round(valor * suavizado));

        if (avance < 1) {
          frame = window.requestAnimationFrame(paso);
        } else {
          escribir(valor);
        }
      };

      frame = window.requestAnimationFrame(paso);
    };

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          animar();
          observer.unobserve(entrada.target);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [duracion, prefijo, sufijo, valor]);

  return (
    <span ref={ref} className={className} aria-label={`${FORMATO.format(valor)}${sufijo}`}>
      {prefijo}
      {FORMATO.format(valor)}
      {sufijo}
    </span>
  );
}
