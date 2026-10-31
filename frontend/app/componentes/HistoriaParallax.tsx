"use client";

import { useEffect, useRef, useState } from "react";
import { HISTORIA_PASOS } from "../lib/nosotros";
import ParallaxImagen from "./ParallaxImagen";

export default function HistoriaParallax() {
  const [activo, setActivo] = useState(0);
  const pasosRef = useRef<(HTMLLIElement | null)[]>([]);

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

  return (
    <section id="nuestra-historia" className="uneti-story position-relative overflow-hidden">
      <div className="uneti-story__fondo" aria-hidden="true">
        <ParallaxImagen
          src="/assets/images/uneti/nosotros-fondo.webp"
          alt=""
          className="uneti-story__fondo-img"
          velocidad={0.03}
        />
      </div>

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

        <div className="row align-items-start g-5">
          <div className="col-lg-5 d-none d-lg-block">
            <div className="uneti-story__media">
              {HISTORIA_PASOS.map((paso, indice) => (
                <ParallaxImagen
                  key={paso.id}
                  src={paso.image}
                  alt={paso.alt}
                  className={`uneti-story__imagen${indice === activo ? " is-active" : ""}`}
                  velocidad={0.04}
                  loading={indice === 0 ? "eager" : "lazy"}
                />
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
