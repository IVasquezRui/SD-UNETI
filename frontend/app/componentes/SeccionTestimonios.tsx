import { TESTIMONIOS } from "../lib/institucional";
import CarruselSimple from "./CarruselSimple";
import Reveal from "./Reveal";

const HIGHLIGHTS = [
  { icon: "bi bi-currency-bitcoin", label: "Blockchain" },
  { icon: "bi bi-badge-vr", label: "Metaverso" },
  { icon: "bi bi-robot", label: "Inteligencia artificial" },
  { icon: "bi bi-box", label: "Modelado 3D" },
  { icon: "bi bi-broadcast", label: "Telecomunicaciones" },
];

export default function SeccionTestimonios() {
  return (
    <section
      id="testimonials"
      className="uneti-testimonials position-relative bg-gradient-aztec-green overflow-hidden"
    >
      <div
        className="background-position-center-top h-100 w-100 position-absolute left-0px top-0"
        style={{ backgroundImage: "url('/assets/images/vertical-line-bg-small.svg')" }}
        aria-hidden="true"
      ></div>

      <div className="container position-relative">
        <div className="row justify-content-center align-items-center">
          <Reveal className="col-lg-5 position-relative md-mb-50px sm-mb-25px">
            <span className="uneti-section-eyebrow text-white mb-15px">Testimonios</span>
            <h2 className="alt-font text-white fw-600 ls-minus-3px w-90 lg-w-100 mb-20px">
              Nuestros estudiantes opinan.
            </h2>
            <p className="w-80 lg-w-100 text-white opacity-5">
              Conoce cómo la formación UNETI impulsa proyectos profesionales y transforma
              trayectorias.
            </p>
            <a
              href="/contacto"
              className="btn btn-large btn-base-color btn-rounded btn-switch-text fw-600"
            >
              <span>
                <span className="btn-double-text" data-text="Comparte tu experiencia">
                  Comparte tu experiencia
                </span>
                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal className="col-lg-7 position-relative" delay={120}>
            <CarruselSimple
              label="Testimonios de estudiantes de la UNETI"
              className="uneti-testimonios__carrusel"
              autoPlay
              intervalo={7000}
            >
              {TESTIMONIOS.map((testimonio) => (
                <article className="uneti-testimonial-card" key={testimonio.name}>
                  <i className="bi bi-quote uneti-testimonial-card__quote" aria-hidden="true"></i>
                  <div className="uneti-testimonial-card__stars">
                    {Array.from({ length: testimonio.rating }).map((_, index) => (
                      <i className="bi bi-star-fill" key={index} aria-hidden="true"></i>
                    ))}
                    <span>{testimonio.rating}.0</span>
                  </div>
                  <blockquote>“{testimonio.quote}”</blockquote>
                  <div className="uneti-testimonial-card__person">
                    <img
                      src={testimonio.image}
                      alt={testimonio.name}
                      width={600}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <strong>{testimonio.name}</strong>
                      <span>
                        {testimonio.role} · {testimonio.location}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </CarruselSimple>
          </Reveal>
        </div>

        <Reveal className="row row-cols-2 row-cols-md-3 row-cols-lg-5 text-center justify-content-center mt-6">
          {HIGHLIGHTS.map((item) => (
            <div className="col mb-20px" key={item.label}>
              <div className="uneti-testimonials__highlight">
                <i className={`${item.icon} fs-24 d-block mb-5px`} aria-hidden="true"></i>
                <span className="fs-14 text-uppercase ls-1px">{item.label}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
