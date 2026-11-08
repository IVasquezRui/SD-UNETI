import type { CSSProperties } from "react";
import { CURSOS } from "../lib/cursos";
import Reveal from "./Reveal";

/** Resumen de los cursos cortos en la portada: tarjetas enlazadas, sin imágenes. */
export default function SeccionCursosInicio() {
  return (
    <section id="cursos-inicio" className="uneti-cursos-inicio position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Cursos UNETI</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Formación corta para las tecnologías que vienen.
            </h2>
            <p className="mb-0">
              Cuatro rutas gratuitas de formación corta. Toca un curso para ver el temario completo
              en la página de Cursos.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {CURSOS.map((curso, indice) => (
            <Reveal className="col" delay={indice * 80} key={curso.slug}>
              <a
                href={`/cursos#curso-${curso.slug}`}
                className="uneti-curso-mini"
                style={{ "--curso-color": curso.color } as CSSProperties}
                aria-label={`Ver el curso ${curso.titulo}`}
              >
                <span className="uneti-curso-mini__vineta" aria-hidden="true"></span>
                <span className="uneti-curso-mini__icono" aria-hidden="true">
                  <i className={curso.icono}></i>
                </span>
                <h3>{curso.titulo}</h3>
                <p>{curso.resumen}</p>
                <span className="uneti-curso-mini__meta">
                  {curso.duracion} · {curso.nivel}
                </span>
                <span className="uneti-curso-mini__cta">
                  Ver curso
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-auto text-center">
            <a href="/cursos" className="btn btn-large btn-dark-gray btn-rounded btn-switch-text">
              <span>
                <span className="btn-double-text" data-text="Ver todos los cursos">
                  Ver todos los cursos
                </span>
                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
