import { CONTACTO } from "../lib/institucional";
import { obtenerNoticias } from "../lib/noticias";
import SeccionNoticiasEnVivo from "./SeccionNoticiasEnVivo";

export default async function SeccionArticulos() {
  const noticias = await obtenerNoticias(3);

  return (
    <section
      id="articulos"
      className="bg-gradient-tranquil-white overflow-hidden position-relative pb-5 md-pb-7 xs-pb-50px"
    >
      <div className="container pt-6">
        <div className="row justify-content-center align-items-center mb-4 text-center text-md-start">
          <div className="col-lg-8 sm-mb-10px">
            <span className="uneti-section-eyebrow mb-10px">Actualidad</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
              Noticias y vida universitaria
            </h2>
            <p className="mb-0 mt-15px">
              Contenido publicado desde WordPress y actualizado en vivo.
            </p>
          </div>
          <div className="col-lg-4 text-center text-md-end">
            <a
              href="/noticias"
              className="btn btn-link btn-hover-animation-switch btn-extra-large text-dark-gray fw-600"
            >
              <span>
                <span className="btn-text">Todas las noticias</span>
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

        <SeccionNoticiasEnVivo noticiasIniciales={noticias} limite={3} />

        <div className="row justify-content-center mt-5">
          <div className="col-auto icon-with-text-style-08 md-mb-10px xs-mb-15px pe-25px md-pe-15px">
            <div className="feature-box feature-box-left-icon-middle xs-lh-28">
              <div className="feature-box-icon me-10px">
                <i className="feather icon-feather-mail fs-20 text-dark-gray"></i>
              </div>
              <div className="feature-box-content">
                <span className="text-dark-gray fw-500 fs-20 xs-fs-18 ls-minus-05px">
                  ¿Necesitas ayuda?{" "}
                  <a
                    href="/contacto"
                    className="text-decoration-line-bottom-medium text-dark-gray fw-600"
                  >
                    Contáctanos hoy
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="col-auto icon-with-text-style-08 ps-25px md-ps-15px md-pe-15px">
            <div className="feature-box feature-box-left-icon-middle xs-lh-28">
              <div className="feature-box-icon me-10px">
                <i className="feather icon-feather-thumbs-up fs-20 text-dark-gray"></i>
              </div>
              <div className="feature-box-content">
                <span className="text-dark-gray fw-500 fs-20 xs-fs-18 ls-minus-05px">
                  Mantente en contacto.{" "}
                  <a
                    href={CONTACTO.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-line-bottom-medium text-dark-gray fw-600"
                  >
                    Síguenos en Instagram
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
