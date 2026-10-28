import type { Metadata } from "next";
import SeccionActividades from "../componentes/SeccionActividades";
import SeccionPreguntas from "../componentes/SeccionPreguntas";
import TituloPagina from "../componentes/TituloPagina";
import PieSitio from "../componentes/PieSitio";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import ContadorAnimado from "../componentes/ContadorAnimado";
import { ACTIVIDADES_NOSOTROS, PREGUNTAS_NOSOTROS, VALORES } from "../lib/institucional";

export const metadata: Metadata = {
  title: "Acerca de la UNETI | Universidad Nacional Experimental de las Telecomunicaciones e Informática",
  description:
    "Conoce la misión, visión, objetivos estratégicos, modelo educativo y actividades de la UNETI, la universidad venezolana de las telecomunicaciones, la informática y las tecnologías emergentes.",
};

export default function NosotrosPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Acerca de la UNETI"
          subtitle="8+ años innovando en educación tecnológica."
          image="/assets/images/uneti/about-top.webp"
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Sobre Nosotros" }]}
          particleId="about-page-particles"
        />

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-6 col-md-10 md-mb-40px">
                <div className="uneti-about-collage">
                  <img
                    src="/assets/images/uneti/nosotros-principal.webp"
                    alt="Comunidad universitaria de la UNETI"
                    className="uneti-about-main"
                    width={1280}
                    height={576}
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    src="/assets/images/uneti/nosotros-equipo.webp"
                    alt="Formación en telecomunicaciones e informática"
                    className="uneti-about-small"
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="uneti-about-years">
                    <strong>8+</strong>
                    <span>Años innovando</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-10">
                <span className="uneti-section-eyebrow mb-15px">Somos UNETI</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
                  Estamos comprometidos con la educación de calidad e innovadora.
                </h2>
                <p className="mb-20px">
                  UNETI es una universidad dedicada a la formación de profesionales en
                  telecomunicaciones, informática y tecnologías emergentes, con una visión
                  estratégica orientada a la soberanía tecnológica y al desarrollo nacional.
                </p>
                <p className="mb-20px">
                  Nuestra misión es brindar educación de calidad, alineada con las demandas del país
                  y las tendencias globales, bajo la filosofía del aprender haciendo.
                </p>
                <div className="row row-cols-2 g-3 mt-30px">
                  <div className="col">
                    <h3 className="uneti-counter-value alt-font text-dark-gray fw-600 mb-0">
                      <ContadorAnimado valor={7000} sufijo="+" />
                    </h3>
                    <span className="fs-15">Estudiantes confían en UNETI</span>
                  </div>
                  <div className="col">
                    <h3 className="alt-font text-dark-gray fw-600 mb-0">2 PNF</h3>
                    <span className="fs-15">Telecomunicaciones e Informática</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-tranquil-white position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Nuestra esencia</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Educación al servicio de la Nación
                </h2>
                <p className="mb-0">
                  Cuatro pilares resumen el impacto de la UNETI en la formación de talento humano
                  para la transformación digital del país.
                </p>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {VALORES.map((value) => (
                <div className="col" key={value.title}>
                  <article className="uneti-value-card">
                    <span className="uneti-icon-tone uneti-tone-orange">
                      <i className={value.icon}></i>
                    </span>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="uneti-counter-band border-radius-6px p-50px sm-p-30px text-center">
                  <span className="uneti-section-eyebrow text-white mb-15px">Comunidad UNETI</span>
                  <h2 className="alt-font text-white fw-600 ls-minus-2px mb-15px">
                    Somos innovación y creatividad.
                  </h2>
                  <p className="text-white opacity-7 w-80 lg-w-100 mx-auto mb-0">
                    Creemos profundamente en el talento de miles de jóvenes venezolanos que se
                    forman con pensamiento crítico, compromiso social y pasión por el conocimiento.
                    Cada uno de ellos está forjando su futuro con método, innovación y visión
                    transformadora.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SeccionPreguntas
          id="institucional"
          eyebrow="Conoce nuestra casa de estudios"
          title="Misión, visión y modelo educativo"
          description="Los fundamentos que orientan la formación, la investigación y la gestión de la UNETI."
          image="/assets/images/uneti/faq-estudiantes.webp"
          imageAlt="Estudiante de la UNETI"
          items={PREGUNTAS_NOSOTROS}
        />

        <SeccionActividades
          id="actividades"
          eyebrow="Nuestras mejores actividades"
          title="Estamos felices de crear e innovar siempre."
          description="Actividades académicas, culturales y deportivas que complementan la formación de nuestros estudiantes y docentes."
          items={ACTIVIDADES_NOSOTROS}
          image="/assets/images/uneti/actividades-taller.webp"
          imageAlt="Actividades de la UNETI"
          reverse
        />

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
                  ¿Listo para formar parte de la UNETI?
                </h2>
                <p className="mb-40px">
                  Conoce los requisitos, las fechas del proceso y las opciones de ingreso a nuestros
                  Programas Nacionales de Formación.
                </p>
                <a
                  href="/admisiones"
                  className="btn btn-extra-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text left-icon me-15px mb-15px"
                >
                  <span>
                    <span>
                      <i className="feather icon-feather-thumbs-up"></i>
                    </span>
                    <span className="btn-double-text" data-text="Inicia tu admisión">
                      Inicia tu admisión
                    </span>
                  </span>
                </a>
                <a
                  href="/contacto"
                  className="btn btn-extra-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text mb-15px"
                >
                  <span>
                    <span className="btn-double-text" data-text="Habla con nosotros">
                      Habla con nosotros
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

      </main>
      <PieSitio />
    </>
  );
}
