import type { Metadata } from "next";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import PieSitio from "../componentes/PieSitio";
import SeccionNoticiasEnVivo from "../componentes/SeccionNoticiasEnVivo";
import TituloPagina from "../componentes/TituloPagina";
import { obtenerNoticias } from "../lib/noticias";

export const metadata: Metadata = {
  title: "Noticias | UNETI",
  description:
    "Noticias institucionales, vida universitaria, investigación y novedades académicas de la UNETI, publicadas desde WordPress.",
};

export default async function NoticiasPage() {
  const noticias = await obtenerNoticias(50);

  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Últimas noticias"
          subtitle="Información publicada y actualizada desde el CMS de la UNETI."
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Noticias" }]}
          particleId="noticias-page-particles"
        />

        <section className="bg-gradient-tranquil-white overflow-hidden position-relative overlap-height">
          <div className="container overlap-gap-section">
            <div className="row mb-4 md-mb-6">
              <div className="col-12">
                <SeccionNoticiasEnVivo noticiasIniciales={noticias} />
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-auto icon-with-text-style-08 md-mb-10px xs-mb-15px pe-25px md-pe-15px">
                <div className="feature-box feature-box-left-icon-middle xs-lh-28">
                  <div className="feature-box-icon me-10px">
                    <i className="feather icon-feather-mail fs-20 text-dark-gray"></i>
                  </div>
                  <div className="feature-box-content">
                    <span className="text-dark-gray fw-500 fs-20 xs-fs-18 ls-minus-05px">
                      ¿Buscas ayuda?{" "}
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
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-line-bottom-medium text-dark-gray fw-600"
                      >
                        Síguenos en Facebook
                      </a>
                    </span>
                  </div>
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
