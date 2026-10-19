import type { Carrera } from "../lib/carreras";

const OPCIONES = JSON.stringify({
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  centeredSlides: false,
  pagination: { el: ".uneti-galeria-paginacion", clickable: true },
  navigation: {
    nextEl: ".uneti-galeria-siguiente",
    prevEl: ".uneti-galeria-anterior",
  },
  breakpoints: {
    768: { slidesPerView: 2 },
    1200: { slidesPerView: 3 },
  },
});

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

        <div className="swiper uneti-carrera-swiper" data-slider-options={OPCIONES}>
          <div className="swiper-wrapper">
            {carrera.galeria.map((foto) => (
              <div className="swiper-slide" key={foto.imagen}>
                <figure className="uneti-galeria-item mb-0">
                  <img src={foto.imagen} alt={foto.alt} loading="lazy" />
                </figure>
              </div>
            ))}
          </div>
          <div className="d-flex align-items-center justify-content-center mt-30px gap-3">
            <button
              type="button"
              className="uneti-galeria-anterior btn btn-small btn-dark-gray btn-rounded"
              aria-label="Foto anterior"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="uneti-galeria-paginacion"></div>
            <button
              type="button"
              className="uneti-galeria-siguiente btn btn-small btn-dark-gray btn-rounded"
              aria-label="Foto siguiente"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
