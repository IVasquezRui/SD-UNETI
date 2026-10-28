import type { Carrera } from "../lib/carreras";
import CarruselSimple from "./CarruselSimple";

export default function CarruselCarrera({ carrera }: { carrera: Carrera }) {
  return (
    <section className="bg-tranquil position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-4">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Vida académica</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
              Así se vive el {carrera.nombre}
            </h2>
          </div>
        </div>

        <CarruselSimple label={`Galería de ${carrera.nombre}`} className="uneti-carrera-swiper">
          {carrera.galeria.map((foto) => (
            <figure className="uneti-galeria-item mb-0" key={foto.imagen}>
              <img
                src={foto.imagen}
                alt={foto.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{foto.alt}</figcaption>
            </figure>
          ))}
        </CarruselSimple>
      </div>
    </section>
  );
}
