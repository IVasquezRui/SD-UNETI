import { CONTACTO } from "../lib/institucional";

const HERO_STATS = [
  { value: "2", suffix: "", label: "PNF académicos" },
  { value: "7000", suffix: "+", label: "Estudiantes" },
  { value: "100", suffix: "%", label: "Educación gratuita" },
];

const HERO_ANIME =
  '{ "el": "childs", "opacity": [0, 1], "rotateY": [90, 0], "translateY": [80, 0], "translateZ": [50, 0], "staggervalue": 200, "duration": 600, "delay": 100, "easing": "easeOutCirc" }';

const PARTICLE_OPTIONS = JSON.stringify({
  particles: {
    number: { value: 6, density: { enable: true, value_area: 2000 } },
    color: { value: ["#ff7f46", "#ff7f46", "#ff7f46", "#ff7f46", "#ff7f46"] },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
    opacity: { value: 1, random: false, anim: { enable: false, speed: 1, sync: false } },
    size: { value: 8, random: true, anim: { enable: false, sync: true } },
    line_linked: { enable: false, distance: 0, color: "#ffffff", opacity: 1, width: 1 },
    move: { enable: true, speed: 1, direction: "right", random: false, straight: false },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: false, mode: "repulse" },
      onclick: { enable: false, mode: "push" },
      resize: true,
    },
  },
  retina_detect: false,
});

export default function PortadaPrincipal() {
  return (
    <section
      id="hero"
      className="uneti-hero-bg p-0 overflow-hidden bg-dark-gray full-screen ipad-top-space-margin md-h-auto position-relative md-pb-70px sm-pb-40px"
    >
      <div
        id="hero-particles"
        className="h-100 position-absolute left-0px top-0 w-100"
        data-particle="true"
        data-particle-options={PARTICLE_OPTIONS}
      ></div>
      <div className="container h-100 position-relative">
        <div className="row align-items-center justify-content-center h-100">
          <div
            className="col-xl-7 col-lg-7 col-md-12 text-white text-center text-lg-start position-relative z-index-1 d-flex flex-column justify-content-center h-100 md-mt-50px md-mb-20px xs-mb-10px"
            data-anime={HERO_ANIME}
          >
            <span className="uneti-section-eyebrow text-white mb-20px">
              Bienvenid@s a la UNETI
            </span>
            <h1 className="alt-font fs-80 lh-75 sm-fs-55 fw-600 mb-25px ls-minus-2px text-white">
              Formamos.
              <br />
              <span className="text-base-color">Innovamos.</span>
            </h1>
            <div className="mb-30px w-90 md-w-100 overflow-hidden">
              <p className="fs-18 fw-300 opacity-7 mb-0">
                Somos la Universidad de la innovación y la creatividad. Formamos profesionales en
                telecomunicaciones, informática y tecnologías emergentes para la soberanía
                tecnológica de Venezuela.
              </p>
            </div>
            <div className="overflow-hidden">
              <a
                href="/nosotros"
                className="btn btn-extra-large btn-base-color btn-rounded btn-switch-text fw-600 d-inline-block me-25px sm-me-10px align-middle left-icon"
              >
                <span>
                  <span>
                    <i className="feather icon-feather-thumbs-up"></i>
                  </span>
                  <span className="btn-double-text ls-minus-05px" data-text="Leer más">
                    Leer más
                  </span>
                </span>
              </a>
              <a
                href="/carreras"
                className="btn btn-link btn-hover-animation-switch btn-extra-large text-white btn-icon-left"
              >
                <span>
                  <span className="btn-text">Explora las carreras</span>
                  <span className="btn-icon">
                    <i className="feather icon-feather-arrow-right"></i>
                  </span>
                  <span className="btn-icon">
                    <i className="feather icon-feather-arrow-right"></i>
                  </span>
                </span>
              </a>
            </div>
            <div className="row row-cols-3 justify-content-center counter-style-04 w-100 md-w-auto position-absolute lg-position-relative bottom-80px lg-bottom-0px lg-mt-50px">
              {HERO_STATS.map((stat) => (
                <div className="col text-center text-lg-start" key={stat.label}>
                  <h5
                    className="vertical-counter d-inline-flex alt-font text-white fw-600 mb-10px"
                    data-text={stat.suffix}
                    data-to={stat.value}
                  ></h5>
                  <div className="divider-style-03 divider-style-03-01 border-2 border-color-base-color mb-5px w-80 xs-w-90 md-mx-auto"></div>
                  <span className="fw-300 text-white opacity-5">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-20px">
              <a
                href={CONTACTO.helpDesk}
                target="_blank"
                rel="noreferrer"
                className="text-white fs-16 text-decoration-line-bottom"
              >
                ¿Necesitas ayuda? Abre un ticket en la Mesa de Ayuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
