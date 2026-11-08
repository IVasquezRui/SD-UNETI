import { POSGRADOS } from "../lib/posgrados";
import TarjetaPosgrado from "./TarjetaPosgrado";

/** Resumen de la oferta de posgrado (PNFA) dentro de /carreras. */
export default function SeccionPosgrados() {
  return (
    <section id="posgrados" className="uneti-posgrados-section position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Formación avanzada</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Posgrados: Especializaciones, Maestrías y Doctorado
            </h2>
            <p className="mb-0">
              Siete Programas Nacionales de Formación Avanzada (PNFA) para profundizar en
              telecomunicaciones, informática y tecnologías emergentes, con investigación aplicada
              y prácticas especializadas.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {POSGRADOS.map((posgrado) => (
            <div className="col" key={posgrado.slug}>
              <TarjetaPosgrado posgrado={posgrado} />
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-auto text-center">
            <a
              href="/posgrados"
              className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text"
            >
              <span>
                <span className="btn-double-text" data-text="Ver todos los posgrados">
                  Ver todos los posgrados
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
