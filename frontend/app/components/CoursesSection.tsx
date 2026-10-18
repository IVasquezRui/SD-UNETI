const PROGRAMS = [
  {
    icon: "bi bi-broadcast",
    title: "PNF en Telecomunicaciones",
    description:
      "Formación en redes, transmisión, radiofrecuencia, servicios de telecomunicaciones y nuevas tecnologías de conectividad.",
    items: [
      "Técnico Medio al primer año",
      "Técnico Superior Universitario a los 2 años",
      "Ingeniero en 4 años",
    ],
  },
  {
    icon: "bi bi-cpu",
    title: "PNF en Informática",
    description:
      "Desarrollo de software, infraestructura, seguridad informática, ciencia de datos y tecnologías emergentes.",
    items: [
      "Técnico Medio al primer año",
      "Técnico Superior Universitario a los 2 años",
      "Ingeniero en 4 años",
    ],
  },
];

export default function CoursesSection() {
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
        <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
          {PROGRAMS.map((program) => (
            <div className="col" key={program.title}>
              <article className="bg-white border-radius-6px p-40px sm-p-30px h-100 box-shadow-large">
                <span className="uneti-icon-tone uneti-tone-orange mb-20px">
                  <i className={program.icon}></i>
                </span>
                <h3 className="alt-font fs-24 fw-600 text-dark-gray mb-15px">{program.title}</h3>
                <p className="mb-20px">{program.description}</p>
                <ul className="uneti-difference-list mb-30px">
                  {program.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  href="/courses"
                  className="btn btn-medium btn-dark-gray btn-rounded btn-switch-text"
                >
                  <span>
                    <span className="btn-double-text" data-text="Conocer el PNF">
                      Conocer el PNF
                    </span>
                    <span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </span>
                </a>
              </article>
            </div>
          ))}
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-auto text-center">
            <span className="fs-18 text-dark-gray fw-500 me-15px d-block d-md-inline-block mb-15px mb-md-0">
              Educación gratuita · TSU en 2 años · Ingeniería en 4 años
            </span>
            <a href="/courses" className="btn btn-link btn-hover-animation-switch btn-large text-dark-gray fw-600">
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
