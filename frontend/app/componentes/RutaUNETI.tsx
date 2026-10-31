import { CONTACTO } from "../lib/institucional";
import { RUTAS_UNETI } from "../lib/nosotros";
import Reveal from "./Reveal";

export default function RutaUNETI() {
  return (
    <section id="tu-ruta" className="position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Tu ruta</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Elige cómo empezar.
            </h2>
            <p className="mb-0">
              Tres caminos, una misma universidad. Encuentra la información que corresponde a tu
              momento.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {RUTAS_UNETI.map((ruta, indice) => {
            const href = ruta.href === "campus" ? CONTACTO.campus : ruta.href;
            const externo = href.startsWith("http");

            return (
              <Reveal className="col" delay={indice * 90} key={ruta.title}>
                <article className={`uneti-ruta-card uneti-ruta-card--${ruta.tone}`}>
                  <span className="uneti-ruta-card__icono" aria-hidden="true">
                    <i className={ruta.icon}></i>
                  </span>
                  <h3>{ruta.title}</h3>
                  <p>{ruta.description}</p>
                  <a
                    href={href}
                    className="uneti-ruta-card__enlace"
                    {...(externo ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {ruta.cta}
                    <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
