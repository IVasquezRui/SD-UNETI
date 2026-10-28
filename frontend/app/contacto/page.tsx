import type { Metadata } from "next";
import FormularioContacto from "../componentes/FormularioContacto";
import TituloPagina from "../componentes/TituloPagina";
import PieSitio from "../componentes/PieSitio";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import { CONTACTO, CANALES_SOPORTE } from "../lib/institucional";

export const metadata: Metadata = {
  title: "Contacto | UNETI",
  description:
    "Contacta a la UNETI: SIS-UNETI, asistente SISU, admisiones, teléfonos, correo institucional y ubicación en Caracas.",
};

export default function ContactoPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Contáctanos"
          subtitle="Estamos listos para atenderte."
          image="/assets/images/uneti/contacto-estudiantes.webp"
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
          particleId="contact-page-particles"
        />

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row align-items-center mb-5">
              <div className="col-lg-6">
                <span className="uneti-section-eyebrow mb-15px">Hablemos</span>
                <h2 className="alt-font fw-700 text-dark-gray ls-minus-2px mb-0">
                  ¿En qué podemos ayudarte?
                </h2>
              </div>
              <div className="col-lg-6 last-paragraph-no-margin">
                <p className="mb-0">
                  Escríbenos para consultas académicas, admisión, becas o atención al estudiante.
                  Nuestro equipo te responderá en un plazo de dos días hábiles.
                </p>
              </div>
            </div>

            <div className="row align-items-stretch">
              <div className="col-lg-7 lg-mb-30px">
                <div className="border-radius-6px overflow-hidden h-650px md-h-550px sm-h-450px position-relative">
                  <iframe
                    title="Ubicación de la UNETI en Caracas"
                    src="https://maps.google.com/maps?q=Torre%20Ministerial%20El%20Chorro%20Caracas&z=16&output=embed"
                    className="w-100 h-100 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="bg-white p-10 md-p-8 position-relative overflow-hidden box-shadow-extra-large border-radius-6px h-100">
                  <h3 className="alt-font text-dark-gray fw-600 ls-minus-1px mb-20px">
                    UNETI — Nodo Administrativo
                  </h3>
                  <span className="d-block mb-15px">
                    <span className="text-dark-gray fw-600">Dirección:</span>
                    <br />
                    {CONTACTO.address}
                  </span>
                  <span className="d-block mb-15px">
                    <span className="text-dark-gray fw-600">Teléfonos:</span>
                    <br />
                    <a href={CONTACTO.phoneHref} className="text-dark-gray">
                      {CONTACTO.phones[0]}
                    </a>
                    {" / "}
                    <a href="tel:+582125051406" className="text-dark-gray">
                      {CONTACTO.phones[1]}
                    </a>
                  </span>
                  <span className="d-block mb-25px">
                    <span className="text-dark-gray fw-600">Correo:</span>{" "}
                    <a
                      href={`mailto:${CONTACTO.email}`}
                      className="text-dark-gray text-decoration-line-bottom fw-600"
                    >
                      {CONTACTO.email}
                    </a>
                  </span>
                  <a
                    href="https://maps.google.com/?q=Torre+Ministerial+El+Chorro+Caracas"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-large btn-dark-gray btn-box-shadow btn-rounded btn-switch-text"
                  >
                    <span>
                      <span className="btn-double-text" data-text="Ver en Google Maps">
                        Ver en Google Maps
                      </span>
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-tranquil-white position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Canales de atención</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Estamos listos para atender tu solicitud.
                </h2>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {CANALES_SOPORTE.map((channel) => (
                <div className="col" key={channel.title}>
                  <div className="uneti-activity-card">
                    <span className={`uneti-icon-tone uneti-tone-${channel.tone} mb-15px`}>
                      <i className={channel.icon}></i>
                    </span>
                    <h3 className="alt-font fs-18 fw-600 text-dark-gray mb-10px">
                      {channel.title}
                    </h3>
                    <p className="fs-15 fw-400 mb-15px">{channel.description}</p>
                    <a
                      href={channel.href}
                      className="fw-600 text-dark-gray fs-15"
                      {...(channel.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {channel.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center mb-3">
              <div className="col-12 text-center">
                <span className="uneti-section-eyebrow mb-15px">Formulario</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px">
                  Envíanos un mensaje
                </h2>
                <p className="w-60 lg-w-80 mx-auto mt-15px">
                  Completa el formulario y el equipo de atención al estudiante se pondrá en
                  contacto contigo.
                </p>
              </div>
            </div>
            <div className="row justify-content-center mb-10 sm-mb-0">
              <div className="col-xl-9 col-lg-10">
                <div className="bg-white border-radius-6px p-50px md-p-30px box-shadow-large">
                  <FormularioContacto variante="contacto" />
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
