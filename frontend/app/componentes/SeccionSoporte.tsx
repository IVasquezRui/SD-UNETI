import { CANALES_SOPORTE } from "../lib/institucional";
import Reveal from "./Reveal";

export default function SeccionSoporte() {
  return (
    <section className="position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Ecosistema UNETI</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Estamos listos para atender tu solicitud.
            </h2>
            <p className="mb-0">
              Accede al Campus Virtual, consulta el proceso de admisión o comunícate con nuestro
              equipo.
            </p>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-0">
          {CANALES_SOPORTE.map((channel, indice) => (
            <Reveal className="col" delay={indice * 80} key={channel.title}>
              <div className="uneti-support-card p-30px lg-p-25px text-center text-lg-start">
                <span className={`uneti-icon-tone uneti-tone-${channel.tone} mb-20px`}>
                  <i className={channel.icon}></i>
                </span>
                <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-10px">{channel.title}</h3>
                <p className="fs-15 lh-26 mb-20px">{channel.description}</p>
                <a
                  href={channel.href}
                  className="uneti-support-link fs-15"
                  {...(channel.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {channel.cta}
                  <i className="fa-solid fa-arrow-right ms-5px fs-12"></i>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
