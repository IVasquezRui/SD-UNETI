import { DIFERENCIAS } from "../lib/institucional";

export default function SeccionNosotros() {
  return (
    <section
      id="about"
      className="background-position-left-top background-no-repeat position-relative overflow-hidden"
      style={{ backgroundImage: "url('/assets/images/uneti/about_bg.png')" }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div
            className="col-lg-6 col-md-10 position-relative md-mb-40px sm-mb-25px"
            data-anime='{ "opacity": [0,1], "duration": 600, "delay":100, "staggervalue": 300, "easing": "easeOutQuad" }'
          >
            <span className="uneti-section-eyebrow mb-15px">Modalidad híbrida</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
              Estudia en nuestro campus virtual junto a los más calificados expertos.
            </h2>
            <p className="mb-20px">
              Somos una universidad basada en la filosofía del aprender haciendo, con formación en
              las diferentes áreas de las tecnologías disruptivas.
            </p>
            <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-15px">
              ¿Qué nos diferencia?
            </h3>
            <ul className="uneti-difference-list mb-30px">
              {DIFERENCIAS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              href="/nosotros"
              className="btn btn-large btn-dark-gray btn-box-shadow btn-rounded btn-switch-text"
            >
              <span>
                <span className="btn-double-text" data-text="Saber más">
                  Saber más
                </span>
                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </span>
            </a>
          </div>
          <div className="col-lg-6 col-md-10">
            <div className="uneti-about-collage">
              <img
                src="/assets/images/uneti/about_2_img_1.jpg"
                alt="Docentes y estudiantes de la UNETI"
                className="uneti-about-main"
              />
              <img
                src="/assets/images/uneti/about_2_img_2.jpg"
                alt="Formación tecnológica en la UNETI"
                className="uneti-about-small"
              />
              <div className="uneti-about-years">
                <strong>6+</strong>
                <span>Años innovando</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            <div className="uneti-counter-band border-radius-6px p-40px sm-p-30px">
              <div className="row align-items-center justify-content-center text-center text-md-start">
                <div className="col-md-auto md-mb-20px">
                  <h2
                    className="vertical-counter alt-font text-white fw-600 mb-0 me-md-30px"
                    data-text="+"
                    data-to="7000"
                  ></h2>
                </div>
                <div className="col-md-auto text-center text-md-start">
                  <span className="d-block alt-font fs-22 text-white fw-500 lh-30">
                    Estudiantes confían en UNETI
                  </span>
                  <a
                    href="/contacto"
                    className="text-white fs-16 text-decoration-line-bottom"
                  >
                    Únete a nuestra comunidad
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
