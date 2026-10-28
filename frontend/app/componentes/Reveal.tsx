"use client";

import { useEffect, useRef, type ReactNode } from "react";

type PropiedadesReveal = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Aparición progresiva al entrar en el viewport.
 *
 * El contenido siempre existe en el HTML del servidor. La clase que oculta el
 * bloque se agrega únicamente en el cliente, después de la hidratación, para
 * que React y el DOM inicial coincidan.
 */
export default function Reveal({ children, className = "", delay = 0 }: PropiedadesReveal) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefiereMovimientoReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefiereMovimientoReducido || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("uneti-reveal--visible");
          observer.unobserve(entrada.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`uneti-reveal ${className}`.trim()}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
