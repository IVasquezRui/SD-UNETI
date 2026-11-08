import type { Metadata } from "next";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import PieSitio from "../componentes/PieSitio";
import Reveal from "../componentes/Reveal";
import TarjetaCurso from "../componentes/TarjetaCurso";
import TituloPagina from "../componentes/TituloPagina";
import { CURSOS, PASOS_CURSOS } from "../lib/cursos";

export const metadata: Metadata = {
  title: "Cursos | UNETI",
  description:
    "Cursos cortos de blockchain, inteligencia artificial, criptografía y programación asistida con IA (Vibe Coding) en la UNETI.",
};

export default function CursosPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Cursos UNETI"
          subtitle="Formación corta en las tecnologías que están transformando al país."
          image="/assets/images/uneti/cursos-hero.webp"
          imagePosition="center 42%"
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Cursos" }]}
          particleId="cursos-page-particles"
        />

        <section id="cursos" className="bg-tranquil position-relative overlap-height">
          <div className="container overlap-gap-section">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Extensión universitaria</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Aprende haciendo, con acompañamiento docente.
                </h2>
                <p className="mb-0">
                  Cuatro rutas de formación corta y gratuita para estudiantes, docentes y público
                  general. Cada curso combina encuentros guiados, trabajo autónomo y un proyecto
                  final verificable.
                </p>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {CURSOS.map((curso, indice) => (
                <Reveal className="col" delay={indice * 90} key={curso.slug}>
                  <TarjetaCurso curso={curso} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="como-participar" className="position-relative overflow-hidden">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-5 col-md-10 md-mb-40px">
                <span className="uneti-section-eyebrow mb-15px">Cómo participar</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
                  Tres pasos para comenzar.
                </h2>
                <p className="mb-30px">
                  Los cursos se abren por cohortes. La inscripción se realiza en línea y no tiene
                  costo para estudiantes, docentes ni público general.
                </p>
                <div className="border-radius-6px overflow-hidden box-shadow-large">
                  <img
                    src="/assets/images/uneti/innovacion-ia.webp"
                    alt="Formación en inteligencia artificial en la UNETI"
                    className="w-100 h-auto"
                    width={1024}
                    height={768}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="col-lg-6 offset-lg-1 col-md-10">
                <ol className="uneti-course-steps list-unstyled m-0 p-0">
                  {PASOS_CURSOS.map((paso, indice) => (
                    <li key={paso.titulo}>
                      <span className="uneti-course-steps__number" aria-hidden="true">
                        {indice + 1}
                      </span>
                      <div>
                        <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-5px">
                          {paso.titulo}
                        </h3>
                        <p className="mb-0">{paso.descripcion}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="d-flex flex-wrap align-items-center gap-2 mt-30px">
                  <a
                    href="/admisiones"
                    className="btn btn-large btn-dark-gray btn-rounded btn-switch-text"
                  >
                    <span>
                      <span className="btn-double-text" data-text="Inicia tu admisión">
                        Inicia tu admisión
                      </span>
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </span>
                  </a>
                  <a
                    href="/contacto"
                    className="btn btn-large btn-link btn-hover-animation-switch text-dark-gray fw-600"
                  >
                    <span>
                      <span className="btn-text">Habla con nosotros</span>
                      <span className="btn-icon">
                        <i className="feather icon-feather-arrow-right"></i>
                      </span>
                      <span className="btn-icon">
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
