import type { Trayecto } from "../lib/carreras";

export default function MallaCurricular({ trayectos }: { trayectos: Trayecto[] }) {
  return (
    <div className="row row-cols-1 row-cols-lg-2 g-4">
      {trayectos.map((trayecto, indice) => (
        <div className="col" key={trayecto.numero}>
          <article className="uneti-trayecto-card h-100">
            <div className="d-flex align-items-start justify-content-between mb-15px">
              <span className="uneti-trayecto-numero">{String(indice + 1).padStart(2, "0")}</span>
              <span className="uneti-trayecto-label">{trayecto.numero}</span>
            </div>
            <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-10px">
              {trayecto.nombre}
            </h3>
            <p className="fs-15 mb-20px">{trayecto.descripcion}</p>
            <ul className="uneti-unidades-list mb-0">
              {trayecto.unidades.map((unidad) => (
                <li key={unidad}>{unidad}</li>
              ))}
            </ul>
          </article>
        </div>
      ))}
    </div>
  );
}
