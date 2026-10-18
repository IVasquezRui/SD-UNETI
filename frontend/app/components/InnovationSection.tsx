import { INNOVATION_AREAS } from "../lib/institutional";

export default function InnovationSection() {
  return (
    <section className="bg-gradient-tranquil-white position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">En qué estamos trabajando</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Andamos creando para desarrollar áreas innovadoras.
            </h2>
            <p className="mb-0">
              Blockchain, metaverso, inteligencia artificial y modelado 3D: tecnologías disruptivas
              integradas a nuestra formación.
            </p>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {INNOVATION_AREAS.map((area) => (
            <div className="col" key={area.slug}>
              <article className="uneti-work-card">
                <img src={area.image} alt={area.title} />
                <div className="uneti-work-body">
                  <a href={area.href} className="fs-19 d-inline-block mb-10px">
                    {area.title}
                  </a>
                  <p className="fs-15 lh-26 mb-0">{area.description}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-auto text-center">
            <a href="/contact" className="btn btn-large btn-dark-gray btn-rounded btn-switch-text">
              <span>
                <span className="btn-double-text" data-text="Quiero más información">
                  Quiero más información
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
