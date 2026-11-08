import { CONTACTO } from "../lib/institucional";

const REDES = [
  {
    nombre: "Instagram",
    usuario: "@unetivzla",
    href: CONTACTO.instagram,
    icono: "bi bi-instagram",
    tono: "instagram",
  },
  {
    nombre: "Facebook",
    usuario: "UNETI",
    href: CONTACTO.facebook,
    icono: "bi bi-facebook",
    tono: "facebook",
  },
  {
    nombre: "LinkedIn",
    usuario: "UNETI",
    href: CONTACTO.linkedin,
    icono: "bi bi-linkedin",
    tono: "linkedin",
  },
  {
    nombre: "YouTube",
    usuario: "UNETI Educativo",
    href: CONTACTO.youtube,
    icono: "bi bi-youtube",
    tono: "youtube",
  },
];

/** Resumen compacto de las cuatro redes oficiales para la portada. */
export default function RedesSocialesResumen() {
  return (
    <section id="redes" className="uneti-redes position-relative overflow-hidden">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="uneti-section-eyebrow mb-15px">Comunidad UNETI</span>
            <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-15px">
              Síguenos en nuestras redes.
            </h2>
            <p className="mb-0">
              Talleres, encuentros y logros de la comunidad unetista, en un solo lugar.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {REDES.map((red) => (
            <div className="col" key={red.nombre}>
              <a
                href={red.href}
                target="_blank"
                rel="noreferrer"
                className={`uneti-red-card uneti-red-card--${red.tono}`}
                aria-label={`${red.nombre} oficial de la UNETI`}
              >
                <span className="uneti-red-card__icono" aria-hidden="true">
                  <i className={red.icono}></i>
                </span>
                <span className="uneti-red-card__nombre">{red.nombre}</span>
                <span className="uneti-red-card__usuario">{red.usuario}</span>
                <i className="bi bi-arrow-up-right uneti-red-card__flecha" aria-hidden="true"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
