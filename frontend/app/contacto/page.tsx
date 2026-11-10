import type { Metadata } from "next";
import FormularioContacto from "../componentes/FormularioContacto";
import MapaSede from "../componentes/MapaSede";
import TituloPagina from "../componentes/TituloPagina";
import PieSitio from "../componentes/PieSitio";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import { CONTACTO, CANALES_SOPORTE } from "../lib/institucional";
import { SEDES_UNETI } from "../lib/nosotros";

export const metadata: Metadata = {
  title: "Contacto | UNETI",
  description:
    "Contacta a la UNETI: Campus Virtual, admisiones, teléfonos, correo institucional y ubicación en Caracas.",
};

export default function ContactoPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Contáctanos"
          subtitle="Estamos listos para atenderte."
          image="/assets/images/uneti/hero-comunidad.webp"
          imagePosition="center 42%"
          imageFit="completo"
          imageHeight="alto"
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
                  Escríbenos para consultas académicas, de admisión o de atención al estudiante.
                  Nuestro equipo te responderá en un plazo de dos días hábiles.
                </p>
              </div>
            </div>

            <div className="row align-items-end mb-4">
              <div className="col-lg-8">
                <span className="uneti-section-eyebrow mb-15px">Nuestras sedes</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
                  Dos sedes, un mismo proyecto
                </h2>
                <p className="mb-0">
                  La gestión administrativa y la docencia se distribuyen en dos espacios de Caracas.
                  Antes de trasladarte, confirma la atención escribiendo a{" "}
                  <a
                    href={`mailto:${CONTACTO.email}`}
                    className="text-dark-gray fw-600 text-decoration-line-bottom"
                  >
                    {CONTACTO.email}
                  </a>
                  .
                </p>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=UNETI+Caracas"
                  target="_blank"
                  rel="noreferrer"
                  className="uneti-mapa-sede__ruta"
                >
                  Abrir mapa general
                  <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            <div className="uneti-mapa-sede-lista">
              <MapaSede sede={SEDES_UNETI[0]} id="sede-administrativa" />
              <MapaSede sede={SEDES_UNETI[1]} id="nucleo-cantv" invertido />
            </div>
          </div>
        </section>

        <section id="canales" className="bg-gradient-tranquil-white position-relative overflow-hidden">
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

        <section id="formulario-contacto" className="position-relative overflow-hidden">
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
                  <FormularioContacto />
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
