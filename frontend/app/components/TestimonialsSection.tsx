import { TESTIMONIALS } from "../lib/institutional";

const HIGHLIGHTS = [
  { icon: "bi bi-currency-bitcoin", label: "Blockchain" },
  { icon: "bi bi-badge-vr", label: "Metaverso" },
  { icon: "bi bi-robot", label: "Inteligencia artificial" },
  { icon: "bi bi-box", label: "Modelado 3D" },
  { icon: "bi bi-broadcast", label: "Telecomunicaciones" },
];

const TESTIMONIAL_OPTIONS = JSON.stringify({
  slidesPerView: 1,
  spaceBetween: 50,
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  keyboard: { enabled: true, onlyInViewport: true },
  navigation: {
    nextEl: ".swiper-button-next-nav",
    prevEl: ".swiper-button-previous-nav",
  },
});

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="position-relative bg-gradient-aztec-green overflow-hidden"
    >
      <div
        className="background-position-center-top h-100 w-100 position-absolute left-0px top-0"
        style={{ backgroundImage: "url('/assets/images/vertical-line-bg-small.svg')" }}
      ></div>
      <div className="container position-relative">
        <div
          className="row justify-content-center align-items-center"
          data-anime='{ "el": "childs", "opacity": [0, 1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'
        >
          <div className="col-lg-5 position-relative md-mb-50px sm-mb-25px">
            <span className="uneti-section-eyebrow text-white mb-15px">Testimonios</span>
            <h2 className="alt-font text-white fw-600 ls-minus-3px w-90 lg-w-100 mb-20px">
              Nuestros estudiantes opinan.
            </h2>
            <p className="w-80 lg-w-100 text-white opacity-5">
              Qué dicen nuestros estudiantes de nosotros y cómo la formación UNETI impulsa sus
              proyectos profesionales.
            </p>
            <a
              href="/contact"
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
          </div>
          <div className="col-lg-7 position-relative">
            <div className="swiper magic-cursor" data-slider-options={TESTIMONIAL_OPTIONS}>
              <div className="swiper-wrapper pt-20px pb-20px">
                {TESTIMONIALS.map((testimonial) => (
                  <div className="swiper-slide" key={testimonial.name}>
                    <div className="testimonials-box bg-white p-9 sm-p-7 box-shadow-extra-large border-radius-6px">
                      <div className="d-inline-block bg-orange text-white border-radius-50px ps-20px pe-20px fs-15 lh-34 sm-lh-30 ls-minus-1px mb-25px align-middle">
                        {Array.from({ length: testimonial.rating }).map((_, index) => (
                          <i className="bi bi-star-fill" key={index}></i>
                        ))}
                      </div>
                      <div className="testimonials-box-content">
                        <p className="mb-25px fs-18 lh-30">“{testimonial.quote}”</p>
                        <div className="d-flex align-items-center">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-60px h-60px rounded-circle me-15px"
                          />
                          <div>
                            <div className="fs-18 lh-22 fw-600 text-dark-gray">
                              {testimonial.name}, {testimonial.location}
                            </div>
                            <span className="fs-16 lh-20">{testimonial.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="swiper-button-next-nav border-radius-100px swiper-button-next bg-white box-shadow-small">
              <i className="feather icon-feather-chevron-right icon-extra-medium"></i>
            </div>
            <div className="swiper-button-previous-nav border-radius-100px swiper-button-prev bg-white box-shadow-small">
              <i className="feather icon-feather-chevron-left icon-extra-medium"></i>
            </div>
          </div>
        </div>
        <div
          className="row row-cols-2 row-cols-md-3 row-cols-lg-5 text-center justify-content-center mt-6"
          data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 120, "easing": "easeOutQuad" }'
        >
          {HIGHLIGHTS.map((item) => (
            <div className="col mb-20px" key={item.label}>
              <div className="text-white opacity-7">
                <i className={`${item.icon} fs-24 d-block mb-5px`}></i>
                <span className="fs-14 text-uppercase ls-1px">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
