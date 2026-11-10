import { CONTACTO } from "../lib/institucional";
import {
  MODALIDAD_A_DISTANCIA,
  MODALIDAD_PRESENCIAL,
  MODALIDAD_TERRITORIAL,
  REQUISITOS_MODALIDAD,
} from "../lib/nosotros";
import ParallaxImagen from "./ParallaxImagen";
import Reveal from "./Reveal";

export default function ModalidadHibrida() {
  return (
    <section id="modalidad" className="uneti-modality position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center justify-content-center g-5">
          <Reveal className="col-lg-6">
            <div className="uneti-modality__media">
              <ParallaxImagen
                src="/assets/images/uneti/NEW_IMAGES/EquipoDesarrollandoLaptops.jpg"
                alt="Equipo de desarrollo de software de la UNETI trabajando con laptops durante una práctica"
                velocidad={0.06}
              />
              <div className="uneti-modality__sello">
                <span>Modalidad</span>
                <strong>Híbrida y multimodal</strong>
              </div>
            </div>
          </Reveal>

          <Reveal className="col-lg-6" delay={100}>
            <span className="uneti-section-eyebrow mb-15px">Cómo se estudia</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
              Predominio a distancia, prácticas presenciales.
            </h2>
            <p className="mb-30px">
              La formación articula dos componentes que se complementan durante todo el PNF. No
              son dos programas distintos: son partes del mismo recorrido académico.
            </p>

            <div className="uneti-modality__bloques">
              <div className="uneti-modality__bloque">
                <span className="uneti-modality__bloque-icono" aria-hidden="true">
                  <i className="bi bi-laptop"></i>
                </span>
                <div>
                  <h3>Componente a distancia</h3>
                  <ul className="uneti-model-list">
                    {MODALIDAD_A_DISTANCIA.map((item) => (
                      <li key={item}>
                        <i className="bi bi-check2" aria-hidden="true"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="uneti-modality__bloque">
                <span className="uneti-modality__bloque-icono" aria-hidden="true">
                  <i className="bi bi-building-gear"></i>
                </span>
                <div>
                  <h3>Componente presencial</h3>
                  <ul className="uneti-model-list">
                    {MODALIDAD_PRESENCIAL.map((item) => (
                      <li key={item}>
                        <i className="bi bi-check2" aria-hidden="true"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="uneti-modality__acciones">
              <a
                href={CONTACTO.campus}
                target="_blank"
                rel="noreferrer"
                className="btn btn-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text"
              >
                <span>
                  <span className="btn-double-text" data-text="Ir al Campus Virtual">
                    Ir al Campus Virtual
                  </span>
                  <span>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </span>
                </span>
              </a>
              <a
                href={CONTACTO.helpDesk}
                target="_blank"
                rel="noreferrer"
                className="uneti-modality__ayuda"
              >
                Mesa de Ayuda
                <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-5">
          <div className="uneti-requisitos">
            <div className="uneti-requisitos__intro">
              <span className="uneti-section-eyebrow mb-10px">Para estudiar a distancia</span>
              <h3 className="alt-font text-dark-gray fw-600 mb-0">
                Lo que necesitas para participar.
              </h3>
            </div>
            <div className="uneti-requisitos__grid">
              {REQUISITOS_MODALIDAD.map((requisito) => (
                <div className="uneti-requisito" key={requisito.title}>
                  <span className="uneti-requisito__icono" aria-hidden="true">
                    <i className={requisito.icon}></i>
                  </span>
                  <strong>{requisito.title}</strong>
                  <p>{requisito.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal className="mt-5">
          <div className="uneti-territorio">
            <div className="uneti-territorio__intro">
              <span className="uneti-section-eyebrow mb-10px">Cobertura territorial</span>
              <h3 className="alt-font text-dark-gray fw-600 mb-10px">
                Dos sedes propias y una red de espacios aliados.
              </h3>
              <p className="mb-0">
                La UNETI cuenta únicamente con dos sedes propias: la Sede Administrativa y el Núcleo
                CANTV San Martín. Para prácticas y encuentros fuera de Caracas se apoya en
                infraestructura del Estado venezolano.
              </p>
            </div>
            <div className="uneti-territorio__grid">
              {MODALIDAD_TERRITORIAL.map((item) => (
                <div className="uneti-territorio__item" key={item.title}>
                  <span className="uneti-territorio__icono" aria-hidden="true">
                    <i className={item.icon}></i>
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
