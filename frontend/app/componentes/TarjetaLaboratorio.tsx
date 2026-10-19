import type { Laboratorio } from "../lib/carreras";

export default function TarjetaLaboratorio({ laboratorio }: { laboratorio: Laboratorio }) {
  return (
    <article className="uneti-laboratorio-card h-100">
      <div className="uneti-laboratorio-imagen">
        <img src={laboratorio.imagen} alt={laboratorio.nombre} loading="lazy" />
      </div>
      <div className="p-30px sm-p-25px">
        <span className="uneti-icon-tone uneti-tone-blue mb-15px">
          <i className={laboratorio.icono}></i>
        </span>
        <h3 className="alt-font fs-20 fw-600 text-dark-gray mb-10px">
          {laboratorio.nombre}
        </h3>
        <p className="mb-0">{laboratorio.descripcion}</p>
      </div>
    </article>
  );
}
