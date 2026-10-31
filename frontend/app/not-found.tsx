import EncabezadoSitio from "./componentes/EncabezadoSitio";
import PieSitio from "./componentes/PieSitio";
import TituloPagina from "./componentes/TituloPagina";

export default function NotFound() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Página no encontrada"
          subtitle="La dirección que buscas no existe o cambió de lugar."
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Error 404" }]}
          particleId="notfound-page-particles"
        />

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Error 404</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Volvamos a un lugar conocido.
                </h2>
                <p className="mb-40px">
                  Puedes regresar al inicio o explorar la oferta académica y los cursos de la
                  UNETI.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a
                    href="/"
                    className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text"
                  >
                    <span>
                      <span className="btn-double-text" data-text="Ir al inicio">
                        Ir al inicio
                      </span>
                      <span>
                        <i className="feather icon-feather-arrow-right"></i>
                      </span>
                    </span>
                  </a>
                  <a
                    href="/carreras"
                    className="btn btn-large btn-base-color btn-rounded btn-box-shadow btn-switch-text"
                  >
                    <span>
                      <span className="btn-double-text" data-text="Ver las carreras">
                        Ver las carreras
                      </span>
                      <span>
                        <i className="feather icon-feather-arrow-right"></i>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieSitio />
    </>
  );
}
