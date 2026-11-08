import { MODALIDAD_TERRITORIAL } from "../lib/nosotros";
import Reveal from "./Reveal";

/** Resumen de la modalidad híbrida territorial para la portada. */
export default function SeccionModalidadInicio() {
  return (
    <section
      id="modalidad-inicio"
      className="uneti-modalidad-inicio position-relative overflow-hidden"
    >
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Modalidad híbrida</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Estudia a distancia y practica en territorio.
            </h2>
            <p className="mb-0">
              La UNETI combina el Campus Virtual con espacios equipados en alianza con instituciones
              del Estado.{" "}
              <a href="/nosotros#modalidad" className="text-dark-gray fw-600">
                Conoce el modelo completo
              </a>
              .
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {MODALIDAD_TERRITORIAL.map((item, indice) => (
            <Reveal className="col" delay={indice * 80} key={item.title}>
              <article className="uneti-modalidad-card h-100">
                <span className="uneti-modalidad-card__icono" aria-hidden="true">
                  <i className={item.icon}></i>
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
