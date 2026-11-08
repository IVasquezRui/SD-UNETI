import type { Metadata } from "next";
import FormularioAdmision from "../componentes/FormularioAdmision";
import TituloPagina from "../componentes/TituloPagina";
import PieSitio from "../componentes/PieSitio";
import EncabezadoSitio from "../componentes/EncabezadoSitio";

export const metadata: Metadata = {
  title: "Admisiones | UNETI",
  description:
    "Proceso de admisión, requisitos y opciones de ingreso a los Programas Nacionales de Formación de la UNETI.",
};

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
      "Recibe la confirmación y formaliza tu inscripción por los canales oficiales de la UNETI.",
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

        <section id="proceso" className="bg-tranquil position-relative overlap-height">
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
              <div id="formulario" className="col-lg-6">
                <div className="bg-white border-radius-6px p-50px md-p-30px box-shadow-large">
                  <span className="d-inline-block alt-font fs-19 fw-500 text-dark-gray mb-5px">
                    Solicitud en línea
                  </span>
                  <h3 className="alt-font text-dark-gray fw-600 ls-minus-1px mb-30px">
                    Solicitar admisión
                  </h3>
                  <FormularioAdmision />
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
