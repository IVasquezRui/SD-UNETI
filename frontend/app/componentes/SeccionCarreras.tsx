import { CARRERAS } from "../lib/carreras";
import TarjetaCarrera from "./TarjetaCarrera";

export default function SeccionCarreras() {
  return (
    <section id="programas" className="bg-tranquil position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Oferta académica</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Programas Nacionales de Formación
            </h2>
            <p className="mb-0">
              Dos rutas de formación gratuita, con salidas profesionales progresivas y un modelo
              multimodal centrado en el aprender haciendo.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-lg-2 g-4 justify-content-center">
          {CARRERAS.map((carrera) => (
            <div className="col" key={carrera.slug}>
              <TarjetaCarrera carrera={carrera} />
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-auto text-center">
            <span className="fs-18 text-dark-gray fw-500 me-15px d-block d-md-inline-block mb-15px mb-md-0">
              Educación gratuita · TSU en 2 años · Ingeniería en 4 años
            </span>
            <a
              href="/carreras"
              className="btn btn-link btn-hover-animation-switch btn-large text-dark-gray fw-600"
            >
              <span>
                <span className="btn-text">Ver todas las carreras</span>
                <span className="btn-icon">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <span className="btn-icon">
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
