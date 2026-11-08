import type { Metadata } from "next";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import PieSitio from "../componentes/PieSitio";
import SeccionPosgrados from "../componentes/SeccionPosgrados";
import TarjetaCarrera from "../componentes/TarjetaCarrera";
import TituloPagina from "../componentes/TituloPagina";
import { CARRERAS } from "../lib/carreras";

export const metadata: Metadata = {
  title: "Carreras | UNETI",
  description:
    "PNF en Informática y PNF en Telecomunicaciones: formación gratuita con salida de TSU en 2 años e Ingeniería en 4 años en la UNETI.",
};

const VENTAJAS = [
  {
    icono: "bi bi-cash-coin",
    titulo: "Educación gratuita",
    texto: "Pregrado sin costo para estudiantes venezolanos.",
  },
  {
    icono: "bi bi-layers",
    titulo: "Salidas progresivas",
    texto: "TSU a los 2 años y título de Ingeniero a los 4, con prosecución dentro del mismo PNF.",
  },
  {
    icono: "bi bi-laptop",
    titulo: "Modalidad multimodal",
    texto: "Encuentros presenciales, mediación digital y proyectos en territorio.",
  },
  {
    icono: "bi bi-tools",
    titulo: "Aprender haciendo",
    texto: "Laboratorios especializados y proyectos sociotecnológicos desde el primer trayecto.",
  },
];

export default function CarrerasPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Nuestras carreras"
          subtitle="Dos Programas Nacionales de Formación para transformar la tecnología del país."
          image="/assets/images/uneti/carreras-hero-2026.webp"
          imagePosition="center 45%"
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Carreras" }]}
          particleId="carreras-page-particles"
        />

        <section id="oferta" className="bg-tranquil position-relative overlap-height">
          <div className="container overlap-gap-section">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Oferta académica 2026</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Elige tu ruta en la UNETI
                </h2>
                <p className="mb-0">
                  Ambos programas comparten un modelo de formación integral, gratuito y
                  multimodal. Conoce su plan de estudios, laboratorios y campo laboral.
                </p>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-lg-2 g-4">
              {CARRERAS.map((carrera) => (
                <div className="col" key={carrera.slug}>
                  <TarjetaCarrera carrera={carrera} />
                </div>
              ))}
            </div>

            <div id="ventajas" className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mt-5">
              {VENTAJAS.map((ventaja) => (
                <div className="col" key={ventaja.titulo}>
                  <article className="uneti-ventaja-card bg-white border-radius-6px p-30px h-100 box-shadow-large">
                    <span className="uneti-icon-tone uneti-tone-orange mb-15px">
                      <i className={ventaja.icono}></i>
                    </span>
                    <h3 className="alt-font fs-18 fw-600 text-dark-gray mb-10px">
                      {ventaja.titulo}
                    </h3>
                    <p className="fs-15 mb-0">{ventaja.texto}</p>
                  </article>
                </div>
              ))}
            </div>

            <div className="row justify-content-center mt-5">
              <div className="col-lg-9">
                <div className="uneti-counter-band border-radius-6px p-50px sm-p-30px text-center">
                  <span className="uneti-section-eyebrow text-white mb-15px">
                    Admisión 2026
                  </span>
                  <h2 className="alt-font text-white fw-600 ls-minus-2px mb-15px">
                    Tu futuro tecnológico comienza aquí.
                  </h2>
                  <p className="text-white opacity-7 w-80 lg-w-100 mx-auto mb-30px">
                    Consulta los requisitos, completa tu solicitud y acompáñate del equipo de
                    admisiones de la UNETI.
                  </p>
                  <a
                    href="/admisiones"
                    className="btn btn-extra-large btn-base-color btn-rounded btn-switch-text fw-600"
                  >
                    <span>
                      <span className="btn-double-text" data-text="Inicia tu admisión">
                        Inicia tu admisión
                      </span>
                      <span>
                        <i className="feather icon-feather-thumbs-up"></i>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SeccionPosgrados />
      </main>
      <PieSitio />
    </>
  );
}
