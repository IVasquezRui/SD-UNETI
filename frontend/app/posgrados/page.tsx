import type { Metadata } from "next";
import DetallePosgrado from "../componentes/DetallePosgrado";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import FormularioPosgrado from "../componentes/FormularioPosgrado";
import PieSitio from "../componentes/PieSitio";
import Reveal from "../componentes/Reveal";
import TituloPagina from "../componentes/TituloPagina";
import { NIVELES_POSGRADO, POSGRADOS } from "../lib/posgrados";

export const metadata: Metadata = {
  title: "Posgrados | UNETI",
  description:
    "Especializaciones, maestrías y doctorado de la UNETI: siete Programas Nacionales de Formación Avanzada (PNFA) en telecomunicaciones, informática y tecnologías emergentes.",
};

const REQUISITOS_GENERALES = [
  "Título de grado universitario (licenciatura o ingeniería) otorgado por una universidad nacional o extranjera debidamente revalidado o convalidado.",
  "Copia certificada del título, notas de pregrado, resumen curricular acreditado, documento de identidad y fotos tipo carnet.",
  "Anteproyecto o intención de trabajo de grado articulado a las líneas de investigación del programa.",
  "Aprobación de la entrevista académica evaluativa con el comité técnico del programa.",
];

const EGRESO_GENERAL = [
  "Especialización: 100 % de las unidades de crédito (mínimo 27 UC) y Trabajo Especial de Grado.",
  "Maestría: mínimo 36 UC, suficiencia de idioma técnico y Tesis de Maestría con defensa pública.",
  "Doctorado: plan de créditos lectivos e investigativos, publicaciones arbitradas y Tesis Doctoral.",
];

export default function PosgradosPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Posgrados"
          subtitle="Especializaciones, maestrías y doctorado para la Venezuela Digital."
          image="/assets/images/uneti/NEW_IMAGES/Posgrados/robotica/photo_5143169628853964102_y.jpg"
          imagePosition="center 40%"
          imageFit="completo"
          imageHeight="alto"
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Posgrados" }]}
          particleId="posgrados-page-particles"
        />

        <section
          id="oferta"
          className="bg-tranquil position-relative overflow-hidden overlap-height"
        >
          <div className="container overlap-gap-section">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Formación avanzada</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Programas Nacionales de Formación Avanzada
                </h2>
                <p className="mb-0">
                  La oferta de cuarto y quinto nivel de la UNETI abarca Especializaciones,
                  Maestrías y Doctorado. Todos los PNFA integran tres ejes transversales:
                  sociocrítico, epistemológico-metodológico y específico tecnológico.
                </p>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
              {NIVELES_POSGRADO.map((nivel, indice) => (
                <Reveal className="col" delay={indice * 90} key={nivel.nivel}>
                  <article className="uneti-nivel-card h-100">
                    <span className="uneti-nivel-card__icono" aria-hidden="true">
                      <i className={nivel.icono}></i>
                    </span>
                    <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">
                      {nivel.nivel}
                    </h3>
                    <p className="mb-0">{nivel.descripcion}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row g-4">
                  {POSGRADOS.map((posgrado, indice) => (
                    <div className="col-12" key={posgrado.slug}>
                      <DetallePosgrado posgrado={posgrado} indice={indice} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="requisitos" className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Admisión y egreso</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Requisitos generales de los posgrados
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="bg-white border-radius-6px p-40px sm-p-30px h-100 box-shadow-large">
                  <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-20px">Admisión</h3>
                  <ul className="uneti-difference-list mb-0">
                    {REQUISITOS_GENERALES.map((requisito) => (
                      <li key={requisito}>{requisito}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="bg-white border-radius-6px p-40px sm-p-30px h-100 box-shadow-large">
                  <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-20px">Egreso</h3>
                  <ul className="uneti-difference-list mb-0">
                    {EGRESO_GENERAL.map((requisito) => (
                      <li key={requisito}>{requisito}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="row justify-content-center mt-4">
              <div className="col-lg-9 text-center">
                <p className="uneti-sedes__nota mb-0">
                  <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
                  Los diseños curriculares se organizan por ejes y se ajustan al reglamento de
                  estudios avanzados de la UNETI y a las directrices del MPPEU. Confirma fechas y
                  cupos con el equipo de admisiones antes de iniciar tu trámite.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="formulario-posgrados"
          className="bg-gradient-tranquil-white position-relative overflow-hidden"
        >
          <div className="container">
            <div className="row justify-content-center text-center mb-4">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Solicitud en línea</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Admisiones Posgrados
                </h2>
                <p className="mb-0">
                  Completa la solicitud en tres pasos. Al enviarla recibirás un número de ticket
                  para dar seguimiento a tu trámite.
                </p>
              </div>
            </div>

            <div className="row justify-content-center mb-10 sm-mb-0">
              <div className="col-xl-9 col-lg-10">
                <div className="bg-white border-radius-6px p-50px md-p-30px box-shadow-large">
                  <FormularioPosgrado />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieSitio conPrefooter={false} />
    </>
  );
}
