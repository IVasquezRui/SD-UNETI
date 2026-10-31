import { CONTACTO } from "../lib/institucional";
import { SEDES_UNETI } from "../lib/nosotros";
import ParallaxImagen from "./ParallaxImagen";
import Reveal from "./Reveal";

export default function SedesUNETI() {
  return (
    <section id="sedes" className="position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Dónde estamos</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Dos sedes, un mismo proyecto.
            </h2>
            <p className="mb-0">
              La gestión administrativa y la docencia se distribuyen en dos espacios de Caracas.
              Antes de trasladarte, confirma la atención por la Mesa de Ayuda.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-lg-2 g-4">
          {SEDES_UNETI.map((sede, indice) => (
            <Reveal className="col" delay={indice * 100} key={sede.name}>
              <article className="uneti-sede">
                <div className="uneti-sede__media">
                  <ParallaxImagen
                    src={sede.image}
                    alt={sede.alt}
                    velocidad={0.05}
                    loading="lazy"
                  />
                  <span className="uneti-sede__tipo">{sede.kind}</span>
                </div>
                <div className="uneti-sede__cuerpo">
                  <h3 className="alt-font text-dark-gray fw-600 mb-10px">{sede.name}</h3>
                  <p className="uneti-sede__actividad mb-15px">{sede.activity}</p>
                  <dl className="uneti-sede__datos">
                    <div>
                      <dt>
                        <i className="bi bi-geo-alt" aria-hidden="true"></i> Dirección
                      </dt>
                      <dd>{sede.address}</dd>
                    </div>
                    <div>
                      <dt>
                        <i className="bi bi-signpost-2" aria-hidden="true"></i> Referencia
                      </dt>
                      <dd>{sede.reference}</dd>
                    </div>
                    <div>
                      <dt>
                        <i className="bi bi-telephone" aria-hidden="true"></i> Teléfonos
                      </dt>
                      <dd>
                        <a href={CONTACTO.phoneHref}>{CONTACTO.phones[0]}</a>
                        {" · "}
                        <a href="tel:+582125051406">{CONTACTO.phones[1]}</a>
                      </dd>
                    </div>
                  </dl>
                  <a
                    href={sede.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="uneti-sede__mapa"
                  >
                    Ver en Google Maps
                    <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-lg-8 text-center">
            <p className="uneti-sedes__nota mb-0">
              <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
              La UNETI no publica horarios de atención en este sitio. Confirma siempre antes de
              trasladarte.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
