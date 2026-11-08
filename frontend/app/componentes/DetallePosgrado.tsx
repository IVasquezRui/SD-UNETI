import type { CSSProperties } from "react";
import type { Posgrado } from "../lib/posgrados";
import SolicitarCupo from "./SolicitarCupo";

/** Ficha completa de un posgrado: propósito, datos, malla por ejes y requisitos. */
export default function DetallePosgrado({
  posgrado,
  indice,
}: {
  posgrado: Posgrado;
  indice: number;
}) {
  const numero = String(indice + 1).padStart(2, "0");

  return (
    <article
      id={posgrado.slug}
      className="uneti-posgrado-detalle"
      style={{ "--posgrado-color": posgrado.color } as CSSProperties}
    >
      <header className="uneti-posgrado-detalle__head">
        <span className="uneti-posgrado-detalle__numero" aria-hidden="true">
          {numero}
        </span>
        <span className="uneti-posgrado-detalle__icono" aria-hidden="true">
          <i className={posgrado.icono}></i>
        </span>
        <div>
          <span className="uneti-posgrado-detalle__siglas">
            {posgrado.siglas} · {posgrado.nivel}
          </span>
          <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px mb-10px">
            {posgrado.nombre}
          </h2>
          <p className="uneti-posgrado-detalle__resumen mb-0">{posgrado.resumen}</p>
        </div>
      </header>

      <p className="uneti-posgrado-detalle__proposito">{posgrado.proposito}</p>

      <dl className="uneti-posgrado-detalle__datos">
        <div>
          <dt>Duración</dt>
          <dd>{posgrado.duracion}</dd>
        </div>
        <div>
          <dt>Carga académica</dt>
          <dd>{posgrado.carga}</dd>
        </div>
        <div>
          <dt>Grados que otorga</dt>
          <dd>{posgrado.grados.join(" · ")}</dd>
        </div>
      </dl>

      <div className="uneti-posgrado-detalle__malla">
        <h3 className="alt-font text-dark-gray fw-600 mb-20px">Malla curricular</h3>
        <div className="uneti-malla">
          {posgrado.ejes.map((eje) => (
            <section className="uneti-malla__eje" key={eje.eje}>
              <h4>
                <i className={eje.icono} aria-hidden="true"></i>
                {eje.eje}
              </h4>
              <ul>
                {eje.contenidos.map((contenido) => (
                  <li key={contenido}>{contenido}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="uneti-posgrado-detalle__requisitos">
        <details className="uneti-posgrado-detalle__details">
          <summary>
            Requisitos de admisión
            <i className="bi bi-chevron-down" aria-hidden="true"></i>
          </summary>
          <ul>
            {posgrado.requisitos.map((requisito) => (
              <li key={requisito}>{requisito}</li>
            ))}
          </ul>
        </details>

        <details className="uneti-posgrado-detalle__details">
          <summary>
            Requisitos de egreso
            <i className="bi bi-chevron-down" aria-hidden="true"></i>
          </summary>
          <ul>
            {posgrado.egreso.map((requisito) => (
              <li key={requisito}>{requisito}</li>
            ))}
          </ul>
        </details>
      </div>

      <div className="uneti-posgrado-detalle__acciones">
        <SolicitarCupo slug={posgrado.slug} nombre={posgrado.nombre} color={posgrado.color} />
        <a href="#oferta" className="uneti-posgrado-detalle__volver">
          <i className="bi bi-arrow-up" aria-hidden="true"></i>
          Volver a la oferta
        </a>
      </div>
    </article>
  );
}
