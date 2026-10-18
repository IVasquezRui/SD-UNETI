import { CONTACT } from "../lib/institutional";
import { FOOTER_NAV } from "../lib/navigation";
import NewsletterForm from "./NewsletterForm";
import SiteLogo from "./SiteLogo";

const QUICK_LINKS = [
  { label: "Mesa de Ayuda", href: CONTACT.helpDesk },
  { label: "Campus Virtual", href: CONTACT.campus },
  { label: "UNETI 360", href: CONTACT.uneti360 },
  { label: "Canal UNETI Educativo", href: CONTACT.youtube },
];

export default function SiteFooter() {
  return (
    <>
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
                href="/admissions"
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
                <a href={CONTACT.phoneHref}>
                  <i className="feather icon-feather-phone-call"></i>
                  {CONTACT.phones[0]}
                </a>
              </span>
            </div>
          </div>

          <div className="row mb-5 sm-mb-7 xs-mb-30px footer-dark text-center text-sm-start">
            <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column last-paragraph-no-margin md-mb-40px xs-mb-30px">
              <a href="/" className="footer-logo mb-20px d-inline-block">
                <SiteLogo variant="footer" />
              </a>
              <p className="lh-28">
                Universidad Nacional Experimental de las Telecomunicaciones e Informática.
                Formamos profesionales para la soberanía tecnológica de Venezuela.
              </p>
              <div className="elements-social social-text-style-01 mt-5 xs-mt-15px">
                <ul className="small-icon light fw-500">
                  <li>
                    <a
                      className="facebook"
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Fb.
                    </a>
                  </li>
                  <li>
                    <a
                      className="instagram"
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ig.
                    </a>
                  </li>
                  <li>
                    <a className="youtube" href={CONTACT.youtube} target="_blank" rel="noreferrer">
                      Yt.
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 md-mb-40px xs-mb-30px">
              <span className="fw-500 fs-18 d-block text-white mb-15px">Enlaces rápidos</span>
              <ul className="uneti-footer-links p-0 list-unstyled">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer">
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
                  {CONTACT.address}
                </li>
                <li>
                  <i className="bi bi-telephone me-10px"></i>
                  <a href={CONTACT.phoneHref}>{CONTACT.phones[0]}</a>
                  {" / "}
                  <a href="tel:+582125051406">{CONTACT.phones[1]}</a>
                </li>
                <li>
                  <i className="bi bi-envelope me-10px"></i>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
                <li>
                  <i className="bi bi-globe2 me-10px"></i>
                  <a href={CONTACT.website} target="_blank" rel="noreferrer">
                    www.uneti.edu.ve
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-12 col-sm-6 text-md-center text-lg-start">
              <span className="fs-18 fw-500 d-block text-white mb-20px">Boletín de noticias</span>
              <div className="d-inline-block w-100 newsletter-style-02 position-relative mb-15px uneti-newsletter">
                <NewsletterForm />
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
                {FOOTER_NAV.map((item, index) => (
                  <li className={`nav-item${index === 0 ? " active" : ""}`} key={item.label}>
                    <a href={item.href} className={`nav-link${index === 0 ? " ps-0" : ""}`}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-xl-5 last-paragraph-no-margin text-center text-xl-end">
              <p className="fs-16">© 2026 UNETI. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
      <div className="scroll-progress d-none d-xxl-block">
        <a href="#" className="scroll-top" aria-label="Ir arriba">
          <span className="scroll-text">Ir arriba</span>
          <span className="scroll-line">
            <span className="scroll-point"></span>
          </span>
        </a>
      </div>
    </>
  );
}
