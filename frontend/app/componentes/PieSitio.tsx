import { CONTACTO } from "../lib/institucional";
import { NAVEGACION_PIE } from "../lib/navegacion";
import FormularioBoletin from "./FormularioBoletin";
import LogotipoSitio from "./LogotipoSitio";

const ENLACES_RAPIDOS = [
  { label: "Campus Virtual", href: CONTACTO.campus },
  { label: "Mesa de Ayuda", href: CONTACTO.helpDesk },
  { label: "Admisiones", href: "/admisiones" },
  { label: "Contacto", href: "/contacto" },
  { label: "Instagram", href: CONTACTO.instagram },
  { label: "Canal UNETI Educativo", href: CONTACTO.youtube },
];

const MOMENTOS = [
  {
    src: "/assets/images/uneti/hero-uneti.webp",
    alt: "Encuentro de egresados de la UNETI",
  },
  {
    src: "/assets/images/uneti/actividades-taller.webp",
    alt: "Taller de formación tecnológica en la UNETI",
  },
  {
    src: "/assets/images/uneti/STUDENTS/FotoGrupalCurso2.jpg",
    alt: "Estudiantes de la UNETI durante un curso de formación",
  },
  {
    src: "/assets/images/uneti/faq-estudiantes.webp",
    alt: "Estudiante de la UNETI en el campus",
  },
];

function esEnlaceExterno(href: string) {
  return href.startsWith("http");
}

export default function PieSitio({ conPrefooter = true }: { conPrefooter?: boolean }) {
  return (
    <>
      {conPrefooter && (
        <section className="uneti-prefooter" aria-labelledby="uneti-instagram-title">
        <div className="container">
          <div className="uneti-prefooter-card">
            <div className="uneti-prefooter-card__copy">
              <span className="uneti-section-eyebrow text-white mb-15px">Comunidad UNETI</span>
              <h2 id="uneti-instagram-title" className="alt-font text-white fw-600 mb-15px">
                La vida unetista también pasa por Instagram.
              </h2>
              <p className="text-white opacity-7 mb-30px">
                Talleres, encuentros, logros y momentos de nuestra comunidad. Síguenos y sé parte
                de la conversación.
              </p>
              <a
                href={CONTACTO.instagram}
                target="_blank"
                rel="noreferrer"
                className="uneti-prefooter-card__link"
              >
                <i className="bi bi-instagram" aria-hidden="true"></i>
                @unetivzla
                <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
              </a>
            </div>

            <div className="uneti-prefooter-grid">
              {MOMENTOS.map((momento) => (
                <a
                  href={CONTACTO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  key={momento.src}
                  aria-label={`Ver la comunidad UNETI en Instagram: ${momento.alt}`}
                >
                  <img
                    src={momento.src}
                    alt={momento.alt}
                    width={600}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <span aria-hidden="true">
                    <i className="bi bi-instagram"></i>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
        </section>
      )}

      <footer id="site-footer" className="bg-gradient-aztec-green position-relative">
        <div
          className="background-position-center-top h-100 w-100 position-absolute left-0px top-0"
          style={{ backgroundImage: "url('/assets/images/vertical-line-bg-small.svg')" }}
        ></div>
        <div className="container overlap-section position-relative">
          <div className="row g-0 justify-content-center align-items-center text-center text-lg-start bg-base-color border-radius-6px ps-5 pe-5 pt-3 pb-3 mb-8 sm-p-25px">
            <div className="col-lg-auto lg-mb-20px">
              <h6 className="alt-font fw-600 text-dark-gray m-0 ls-minus-1px d-inline-block me-30px lg-me-0">
                Admisiones abiertas para el próximo año académico
              </h6>
            </div>
            <div className="col-auto">
              <a
                href="/admisiones"
                className="btn btn-extra-large btn-dark-gray btn-rounded btn-box-shadow btn-switch-text d-inline-block me-20px align-middle xs-m-0"
              >
                <span>
                  <span className="btn-double-text" data-text="Inicia tu admisión">
                    Inicia tu admisión
                  </span>
                  <span>
                    <i className="feather icon-feather-thumbs-up"></i>
                  </span>
                </span>
              </a>
              <span className="d-block d-sm-inline-block text-dark-gray fs-19 fw-600 left-icon d-inline-block align-middle xs-mt-10px ls-minus-05px">
                <a href={CONTACTO.phoneHref}>
                  <i className="feather icon-feather-phone-call"></i>
                  {CONTACTO.phones[0]}
                </a>
              </span>
            </div>
          </div>

          <div className="row mb-5 sm-mb-7 xs-mb-30px footer-dark text-center text-sm-start">
            <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column last-paragraph-no-margin md-mb-40px xs-mb-30px">
              <a href="/" className="footer-logo uneti-footer-logo mb-20px d-inline-block">
                <LogotipoSitio variant="footer" />
              </a>
              <p className="lh-28">
                Universidad Nacional Experimental de las Telecomunicaciones e Informática.
                Formamos profesionales para la soberanía tecnológica de Venezuela.
              </p>
              <ul className="uneti-social" aria-label="Redes sociales de la UNETI">
                <li>
                  <a
                    href={CONTACTO.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram de la UNETI"
                    title="Instagram"
                  >
                    <i className="bi bi-instagram" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACTO.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook de la UNETI"
                    title="Facebook"
                  >
                    <i className="bi bi-facebook" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACTO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn de la UNETI"
                    title="LinkedIn"
                  >
                    <i className="bi bi-linkedin" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACTO.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Canal de YouTube de UNETI Educativo"
                    title="YouTube"
                  >
                    <i className="bi bi-youtube" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 md-mb-40px xs-mb-30px">
              <span className="fw-500 fs-18 d-block text-white mb-15px">Enlaces rápidos</span>
              <ul className="uneti-footer-links p-0 list-unstyled">
                {ENLACES_RAPIDOS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(esEnlaceExterno(link.href)
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 last-paragraph-no-margin md-mb-40px xs-mb-30px">
              <span className="fw-500 fs-18 d-block text-white mb-15px">Nuestros contactos</span>
              <ul className="uneti-footer-links p-0 list-unstyled">
                <li>
                  <i className="bi bi-geo-alt me-10px"></i>
                  {CONTACTO.address}
                </li>
                <li>
                  <i className="bi bi-telephone me-10px"></i>
                  <a href={CONTACTO.phoneHref}>{CONTACTO.phones[0]}</a>
                  {" / "}
                  <a href="tel:+582125051406">{CONTACTO.phones[1]}</a>
                </li>
                <li>
                  <i className="bi bi-envelope me-10px"></i>
                  <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>
                </li>
                <li>
                  <i className="bi bi-globe2 me-10px"></i>
                  <a href={CONTACTO.website} target="_blank" rel="noreferrer">
                    www.uneti.edu.ve
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-12 col-sm-6 text-md-center text-lg-start">
              <span className="fs-18 fw-500 d-block text-white mb-20px">Boletín de noticias</span>
              <div className="d-inline-block w-100 newsletter-style-02 position-relative mb-15px uneti-newsletter">
                <FormularioBoletin />
              </div>
              <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-sm-start justify-content-lg-start fs-14">
                <div className="d-inline-block">
                  <i className="bi bi-shield-check me-10px align-middle icon-very-medium"></i>
                  Suscríbete a nuestra lista de unetistas
                </div>
              </div>
            </div>
          </div>

          <div className="row align-items-center footer-bottom border-top border-color-transparent-white-light pt-30px g-0">
            <div className="col-xl-7 ps-0 text-center text-xl-start lg-mb-10px">
              <ul className="footer-navbar fs-16 lh-normal">
                {NAVEGACION_PIE.map((item, index) => (
                  <li className={`nav-item${index === 0 ? " active" : ""}`} key={item.etiqueta}>
                    <a href={item.href} className={`nav-link${index === 0 ? " ps-0" : ""}`}>
                      {item.etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-xl-5 last-paragraph-no-margin text-center text-xl-end">
              <p className="fs-16">
                <a href="/privacidad" className="text-white text-decoration-line-bottom">
                  Política de privacidad
                </a>
                {" · "}© 2026 UNETI. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
