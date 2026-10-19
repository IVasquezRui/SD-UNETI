import type { Carrera } from "../lib/carreras";

export default function TarjetaCarrera({ carrera }: { carrera: Carrera }) {
  return (
    <article className="uneti-carrera-card card border-0 border-radius-6px overflow-hidden box-shadow-large h-100">
      <div className="uneti-carrera-imagen position-relative overflow-hidden">
        <a href={`/carreras/${carrera.slug}`} aria-label={carrera.nombre}>
          <img src={carrera.portada} alt={carrera.nombre} loading="lazy" />
        </a>
        <span className="uneti-carrera-codigo">{carrera.codigo}</span>
      </div>
      <div className="card-body p-40px sm-p-30px d-flex flex-column">
        <span className="uneti-icon-tone uneti-tone-orange mb-20px">
          <i className={carrera.icono}></i>
        </span>
        <h2 className="alt-font fs-28 fw-600 text-dark-gray mb-10px">{carrera.nombre}</h2>
        <p className="uneti-carrera-lema">{carrera.lema}</p>
        <p className="mb-20px">{carrera.resumen}</p>
        <ul className="uneti-difference-list mb-30px">
          {carrera.salidas.map((salida) => (
            <li key={salida.nivel}>
              <strong>{salida.nivel}:</strong> {salida.duracion}
            </li>
          ))}
        </ul>
        <div className="mt-auto d-flex flex-wrap align-items-center gap-2">
          <a
            href={`/carreras/${carrera.slug}`}
            className="btn btn-medium btn-dark-gray btn-rounded btn-switch-text"
          >
            <span>
              <span className="btn-double-text" data-text="Conocer el PNF">
                Conocer el PNF
              </span>
              <span>
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </span>
          </a>
          <a
            href="/admisiones"
            className="btn btn-medium btn-link btn-hover-animation-switch text-dark-gray fw-600"
          >
            <span>
              <span className="btn-text">Inscribirme</span>
              <span className="btn-icon">
                <i className="feather icon-feather-arrow-right"></i>
              </span>
              <span className="btn-icon">
                <i className="feather icon-feather-arrow-right"></i>
              </span>
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
