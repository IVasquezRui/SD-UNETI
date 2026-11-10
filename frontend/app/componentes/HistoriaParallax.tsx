"use client";

import { useEffect, useRef, useState } from "react";
import { HISTORIA_PASOS } from "../lib/nosotros";
import ParallaxImagen from "./ParallaxImagen";

export default function HistoriaParallax() {
  const [activo, setActivo] = useState(0);
  const pasosRef = useRef<(HTMLLIElement | null)[]>([]);
  const filaRef = useRef<HTMLDivElement>(null);
  const escenarioRef = useRef<HTMLDivElement>(null);
  const tarjetaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const indice = Number((entrada.target as HTMLElement).dataset.indice);
          if (!Number.isNaN(indice)) setActivo(indice);
        }
      },
      { rootMargin: "-38% 0px -42% 0px", threshold: 0 },
    );

    pasosRef.current.forEach((nodo) => {
      if (nodo) observer.observe(nodo);
    });

    return () => observer.disconnect();
  }, []);

  // La tarjeta de imágenes viaja hasta el paso que se está leyendo.
  useEffect(() => {
    const fila = filaRef.current;
    const escenario = escenarioRef.current;
    const tarjeta = tarjetaRef.current;
    if (!fila || !escenario || !tarjeta) return;

    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const escritorio = window.matchMedia("(min-width: 992px)");

    let frame = 0;

    const aplicar = () => {
      frame = 0;

      if (!escritorio.matches || movimientoReducido.matches) {
        tarjeta.style.removeProperty("--story-y");
        return;
      }

      const paso = pasosRef.current[activo];
      if (!paso) return;

      const rectFila = fila.getBoundingClientRect();
      const rectPaso = paso.getBoundingClientRect();
      const altoTarjeta = tarjeta.offsetHeight;
      const recorrido = Math.max(0, escenario.clientHeight - altoTarjeta);
      const centroPaso = rectPaso.top + rectPaso.height / 2 - rectFila.top;
      const destino = centroPaso - altoTarjeta / 2;
      const desplazamiento = Math.min(recorrido, Math.max(0, destino));

      tarjeta.style.setProperty("--story-y", `${desplazamiento.toFixed(1)}px`);
    };

    const programar = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(aplicar);
    };

    programar();
    window.addEventListener("resize", programar);
    escritorio.addEventListener("change", programar);
    movimientoReducido.addEventListener("change", programar);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", programar);
      escritorio.removeEventListener("change", programar);
      movimientoReducido.removeEventListener("change", programar);
      tarjeta.style.removeProperty("--story-y");
    };
  }, [activo]);

  // Deriva parallax de la imagen dentro de la tarjeta según el avance de la fila.
  useEffect(() => {
    const fila = filaRef.current;
    if (!fila) return;

    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const escritorio = window.matchMedia("(min-width: 992px)");

    let frame = 0;

    const aplicar = () => {
      frame = 0;

      if (!escritorio.matches || movimientoReducido.matches) {
        fila.style.removeProperty("--story-drift");
        return;
      }

      const rect = fila.getBoundingClientRect();
      const altoVentana = window.innerHeight;
      if (rect.bottom < 0 || rect.top > altoVentana) return;

      const progreso = (altoVentana - rect.top) / (altoVentana + rect.height);
      const limitado = Math.min(1, Math.max(0, progreso));
      const deriva = (limitado - 0.5) * 56;

      fila.style.setProperty("--story-drift", `${deriva.toFixed(1)}px`);
    };

    const programar = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(aplicar);
    };

    aplicar();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar);
    escritorio.addEventListener("change", programar);
    movimientoReducido.addEventListener("change", programar);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
      escritorio.removeEventListener("change", programar);
      movimientoReducido.removeEventListener("change", programar);
      fila.style.removeProperty("--story-drift");
    };
  }, []);

  return (
    <section id="nuestra-historia" className="uneti-story position-relative overflow-hidden">
      <div className="container position-relative">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow text-white mb-15px">Nuestra historia</span>
            <h2 className="alt-font text-white fw-600 ls-minus-3px mb-15px">
              Formamos ingenieros para la Venezuela Digital.
            </h2>
            <p className="text-white opacity-7 mb-0">
              Una universidad pública, tecnológica y multimodal que combina la educación a
              distancia con prácticas presenciales en espacios equipados.
            </p>
          </div>
        </div>

        <div ref={filaRef} className="row align-items-stretch g-5">
          <div ref={escenarioRef} className="col-lg-5 d-none d-lg-block uneti-story__escenario">
            <div ref={tarjetaRef} className="uneti-story__media">
              {HISTORIA_PASOS.map((paso, indice) => (
                <span
                  key={paso.id}
                  className={`uneti-story__capa${indice === activo ? " is-active" : ""}`}
                >
                  <img
                    src={paso.image}
                    alt={indice === activo ? paso.alt : ""}
                    className="uneti-story__imagen"
                    width={1280}
                    height={853}
                    loading={indice === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </span>
              ))}
              <span className="uneti-story__contador" aria-hidden="true">
                <strong>0{activo + 1}</strong> / 0{HISTORIA_PASOS.length}
              </span>
            </div>
          </div>

          <div className="col-lg-7">
            <ol className="uneti-story__pasos">
              {HISTORIA_PASOS.map((paso, indice) => (
                <li
                  key={paso.id}
                  ref={(nodo) => {
                    pasosRef.current[indice] = nodo;
                  }}
                  data-indice={indice}
                  className={`uneti-story__paso${indice === activo ? " is-active" : ""}`}
                >
                  <span className="uneti-story__eyebrow">{paso.eyebrow}</span>
                  <h3>{paso.title}</h3>
                  <p>{paso.description}</p>
                  <div className="uneti-story__media-movil">
                    <ParallaxImagen src={paso.image} alt={paso.alt} velocidad={0.03} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="uneti-story__datos">
          <div>
            <strong>2</strong>
            <span>PNF oficiales</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Años de TSU</span>
          </div>
          <div>
            <strong>4</strong>
            <span>Años de Ingeniería</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Docencia de pregrado gratuita</span>
          </div>
        </div>
      </div>
    </section>
  );
}
