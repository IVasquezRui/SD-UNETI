import { CONTACTO } from "../lib/institucional";
import { NAVEGACION_PRINCIPAL } from "../lib/navegacion";
import LogotipoSitio from "./LogotipoSitio";

export default function EncabezadoSitio() {
  return (
    <header>
      <nav
        className="navbar navbar-expand-lg header-transparent bg-transparent header-reverse"
        data-header-hover="light"
      >
        <div className="container-fluid">
          <div className="col-auto col-lg-2 me-lg-0 me-auto">
            <a className="navbar-brand" href="/" aria-label="UNETI inicio">
              <LogotipoSitio variant="light" className="default-logo" />
              <LogotipoSitio variant="dark" className="alt-logo" />
              <LogotipoSitio variant="dark" className="mobile-logo" />
            </a>
          </div>
          <div className="col-auto menu-order position-static">
            <button
              className="navbar-toggler float-start"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-label="Abrir navegación"
            >
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
              <span className="navbar-toggler-line"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav alt-font">
                {NAVEGACION_PRINCIPAL.map((item) => (
                  <li className="nav-item" key={item.href}>
                    <a href={item.href} className="nav-link">
                      {item.etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-auto col-lg-3 text-end d-none d-sm-flex align-items-center justify-content-end">
            <div className="header-icon">
              <div>
                <div className="alt-font fw-500 lg-fs-15">
                  <a href={CONTACTO.phoneHref} className="widget-text text-white-hover">
                    <i className="feather icon-feather-phone-call me-10px lg-me-5px"></i>
                    {CONTACTO.phones[0]}
                  </a>
                </div>
              </div>
            </div>
            <a
              href={CONTACTO.helpDesk}
              target="_blank"
              rel="noreferrer"
              className="btn btn-small btn-base-color btn-rounded fw-600 ms-25px d-none d-xl-inline-flex"
            >
              Mesa de Ayuda
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

