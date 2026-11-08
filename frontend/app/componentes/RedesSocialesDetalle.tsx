import type { CSSProperties } from "react";
import { CONTACTO } from "../lib/institucional";
import Reveal from "./Reveal";

const REDES = [
  {
    nombre: "Instagram",
    usuario: "@unetivzla",
    href: CONTACTO.instagram,
    icono: "bi bi-instagram",
    color: "#e1306c",
    imagen: "/assets/images/uneti/STUDENTS/FotoGrupalCurso3.jpg",
    alt: "Estudiantes de la UNETI en un encuentro",
    descripcion: "Talleres, encuentros y el día a día de la comunidad unetista.",
  },
  {
    nombre: "Facebook",
    usuario: "UNETI",
    href: CONTACTO.facebook,
    icono: "bi bi-facebook",
    color: "#1877f2",
    imagen: "/assets/images/uneti/STUDENTS/FotoGrupalCurso2.jpg",
    alt: "Participantes de un curso de la UNETI",
    descripcion: "Noticias institucionales, actividades y convocatorias.",
  },
  {
    nombre: "LinkedIn",
    usuario: "UNETI",
    href: CONTACTO.linkedin,
    icono: "bi bi-linkedin",
    color: "#0a66c2",
    imagen: "/assets/images/uneti/STUDENTS/estudiantes.png",
    alt: "Estudiantes de la UNETI en el campus",
    descripcion: "Talento, egresados y oportunidades de colaboración.",
  },
  {
    nombre: "YouTube",
    usuario: "UNETI Educativo",
    href: CONTACTO.youtube,
    icono: "bi bi-youtube",
    color: "#ff0033",
    imagen: "/assets/images/uneti/STUDENTS/faq_img_2.jpg",
    alt: "Estudiante de la UNETI en una actividad académica",
    descripcion: "Clases abiertas, transmisiones y material formativo.",
  },
];

/** Detalle animado de las cuatro redes oficiales para /nosotros. */
export default function RedesSocialesDetalle() {
  return (
    <section id="comunidad" className="uneti-redes-detalle position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Comunidad UNETI</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Somos innovación y creatividad.
            </h2>
            <p className="mb-0">
              Creemos profundamente en el talento de miles de jóvenes venezolanos que se forman con
              pensamiento crítico y compromiso social. Síguenos en nuestras cuatro redes oficiales.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {REDES.map((red, indice) => (
            <Reveal className="col" delay={indice * 90} key={red.nombre}>
              <a
                href={red.href}
                target="_blank"
                rel="noreferrer"
                className="uneti-red-detalle"
                style={{ "--red-color": red.color } as CSSProperties}
                aria-label={`${red.nombre} oficial de la UNETI`}
              >
                <span className="uneti-red-detalle__media">
                  <img
                    src={red.imagen}
                    alt={red.alt}
                    width={900}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="uneti-red-detalle__icono" aria-hidden="true">
                    <i className={red.icono}></i>
                  </span>
                </span>
                <span className="uneti-red-detalle__cuerpo">
                  <strong>{red.nombre}</strong>
                  <small>{red.usuario}</small>
                  <span className="uneti-red-detalle__texto">{red.descripcion}</span>
                  <span className="uneti-red-detalle__cta">
                    Seguir
                    <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
