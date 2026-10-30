import type { Metadata } from "next";
import FormularioContacto from "../componentes/FormularioContacto";
import TituloPagina from "../componentes/TituloPagina";
import PieSitio from "../componentes/PieSitio";
import EncabezadoSitio from "../componentes/EncabezadoSitio";

export const metadata: Metadata = {
  title: "Admisiones | UNETI",
  description:
    "Proceso de admisión, requisitos y opciones de ingreso a los Programas Nacionales de Formación de la UNETI.",
};

const PROGRAMAS = ["PNF en Telecomunicaciones", "PNF en Informática"];

const PASOS = [
  {
    number: "1",
    title: "Regístrate en el Sistema Nacional de Ingreso",
    description:
      "La UNETI se rige por los estándares de la OPSU. Regístrate ante el SNI y selecciona nuestros Programas Nacionales de Formación.",
  },
  {
    number: "2",
    title: "Consigna tus documentos",
    description:
      "Título de bachiller, notas certificadas, cédula de identidad y una foto reciente en formato digital.",
  },
  {
    number: "3",
    title: "Orientación académica",
    description:
      "Un docente del programa te orienta sobre la modalidad híbrida, las prácticas profesionales y las salidas profesionales.",
  },
  {
    number: "4",
    title: "Confirma tu ingreso",
    description:
      "Recibe la confirmación, accede al SIS-UNETI y comienza tu formación como unetista.",
  },
];

const BECAS = [
  {
    icon: "bi bi-award",
    title: "Excelencia académica",
    description: "Reconocimiento para estudiantes con promedio sobresaliente en educación media.",
  },
  {
    icon: "bi bi-people",
    title: "Compromiso comunitario",
    description: "Apoyo para estudiantes que lideran proyectos sociales o comunitarios.",
  },
  {
    icon: "bi bi-globe",
    title: "Talento en investigación",
    description: "Impulso para quienes participan en semilleros de investigación desde el primer semestre.",
  },
];

export default function AdmisionesPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Admisiones"
          subtitle="Inicia tu proceso de ingreso a la UNETI."
          image="/assets/images/uneti/nosotros-principal.webp"
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Admisiones" }]}
        />

        <section className="bg-tranquil position-relative overlap-height">
          <div className="container overlap-gap-section">
            <div className="row justify-content-center align-items-start">
              <div className="col-lg-6 lg-mb-40px">
                <span className="d-inline-block alt-font fs-19 fw-500 text-dark-gray mb-10px">
                  Proceso de admisión
                </span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-30px">
                  Pasos para ingresar a la UNETI
                </h2>
                <div className="row g-3">
                  {PASOS.map((step) => (
                    <div className="col-12" key={step.number}>
                      <div className="d-flex bg-white border-radius-6px p-30px md-p-25px">
                        <span className="alt-font fs-40 fw-700 text-base-color me-20px lh-1">
                          {step.number}
                        </span>
                        <div>
                          <span className="d-block fs-18 fw-600 text-dark-gray mb-5px">
                            {step.title}
                          </span>
                          <p className="mb-0">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-dark-gray border-radius-6px p-30px mt-30px">
                  <span className="d-block fs-18 fw-600 text-white mb-10px">
                    Documentos requeridos
                  </span>
                  <ul className="p-0 m-0 list-style-02 text-white">
                    <li className="mb-5px">Título de bachiller o documento equivalente</li>
                    <li className="mb-5px">Notas certificadas de educación media</li>
                    <li className="mb-5px">Cédula de identidad vigente</li>
                    <li className="mb-0">Foto reciente tipo carnet</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="bg-white border-radius-6px p-50px md-p-30px box-shadow-large">
                  <span className="d-inline-block alt-font fs-19 fw-500 text-dark-gray mb-5px">
                    Solicitud en línea
                  </span>
                  <h3 className="alt-font text-dark-gray fw-600 ls-minus-1px mb-30px">
                    Solicitar admisión
                  </h3>
                  <FormularioContacto variante="inscripcion" programas={PROGRAMAS} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-very-light-gray">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-7">
                <span className="d-inline-block alt-font fs-19 fw-500 text-dark-gray mb-10px">
                  Becas
                </span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Apoyo para tus estudios
                </h2>
                <p className="mb-0">
                  Cada semestre abrimos un número limitado de becas parciales para estudiantes
                  con mérito académico, compromiso comunitario o interés en investigación.
                </p>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4 mb-6">
              {BECAS.map((scholarship) => (
                <div className="col" key={scholarship.title}>
                  <div className="bg-white border-radius-6px p-30px h-100 box-shadow-large">
                    <div className="feature-box-icon-rounded w-60px h-60px rounded-circle bg-yellow d-flex align-items-center justify-content-center mb-20px">
                      <i className={`${scholarship.icon} icon-extra-medium text-dark-gray`}></i>
                    </div>
                    <span className="d-block fs-18 fw-600 text-dark-gray mb-5px">
                      {scholarship.title}
                    </span>
                    <p className="mb-0">{scholarship.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="row justify-content-center">
              <div className="col-xl-9 col-lg-10">
                <div className="bg-white border-radius-6px p-50px md-p-30px box-shadow-large">
                  <span className="d-inline-block alt-font fs-19 fw-500 text-dark-gray mb-5px">
                    Solicitud de beca
                  </span>
                  <h3 className="alt-font text-dark-gray fw-600 ls-minus-1px mb-30px">
                    Solicitar una beca
                  </h3>
                  <FormularioContacto variante="beca" programas={PROGRAMAS} />
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
