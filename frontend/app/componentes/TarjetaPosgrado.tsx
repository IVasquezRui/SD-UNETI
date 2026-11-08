import type { CSSProperties } from "react";
import type { Posgrado } from "../lib/posgrados";
import SolicitarCupo from "./SolicitarCupo";

/** Tarjeta resumen de un posgrado para el listado de /carreras. */
export default function TarjetaPosgrado({ posgrado }: { posgrado: Posgrado }) {
  return (
    <article
      className="uneti-posgrado-card h-100"
      style={{ "--posgrado-color": posgrado.color } as CSSProperties}
    >
      <div className="uneti-posgrado-card__head">
        <span className="uneti-posgrado-card__icono" aria-hidden="true">
          <i className={posgrado.icono}></i>
        </span>
        <span className="uneti-posgrado-card__siglas">{posgrado.siglas}</span>
      </div>

      <span className="uneti-posgrado-card__nivel">{posgrado.nivel}</span>
      <h3>{posgrado.nombre}</h3>
      <p className="uneti-posgrado-card__resumen">{posgrado.resumen}</p>

      <dl className="uneti-posgrado-card__meta">
        <div>
          <dt>Duración</dt>
          <dd>{posgrado.duracion}</dd>
        </div>
        <div>
          <dt>Carga académica</dt>
          <dd>{posgrado.carga}</dd>
        </div>
      </dl>

      <div className="uneti-posgrado-card__acciones">
        <a href={`/posgrados#${posgrado.slug}`} className="uneti-posgrado-card__detalle">
          Ver malla curricular
          <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
        </a>
        <SolicitarCupo
          slug={posgrado.slug}
          nombre={posgrado.nombre}
          color={posgrado.color}
          variante="ghost"
        />
      </div>
    </article>
  );
}
