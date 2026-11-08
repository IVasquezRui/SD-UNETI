import { CONTACTO } from "../lib/institucional";
import type { SedeUNETI } from "../lib/nosotros";

type PropiedadesMapaSede = {
  sede: SedeUNETI;
  /** Ancla usada por la navegación rápida. */
  id: string;
  invertido?: boolean;
};

/** Mapa embebido de Google Maps + ficha de la sede. */
export default function MapaSede({ sede, id, invertido = false }: PropiedadesMapaSede) {
  const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    sede.address,
  )}`;

  return (
    <div id={id} className="uneti-mapa-sede">
      <div className={`uneti-mapa-sede__mapa${invertido ? " uneti-mapa-sede__mapa--derecha" : ""}`}>
        <iframe
          title={`Ubicación de ${sede.name} en Caracas`}
          src={sede.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        ></iframe>
      </div>

      <div className="uneti-mapa-sede__ficha">
        <span className="uneti-mapa-sede__tipo">{sede.kind}</span>
        <h3 className="alt-font text-dark-gray fw-600 ls-minus-1px mb-15px">{sede.name}</h3>
        <p className="uneti-mapa-sede__actividad">{sede.activity}</p>

        <dl className="uneti-sede__datos">
          <div>
            <dt>
              <i className="bi bi-geo-alt" aria-hidden="true"></i> Dirección
            </dt>
            <dd>{sede.address}</dd>
          </div>
          <div>
            <dt>
              <i className="bi bi-signpost-2" aria-hidden="true"></i> Referencia
            </dt>
            <dd>{sede.reference}</dd>
          </div>
          <div>
            <dt>
              <i className="bi bi-telephone" aria-hidden="true"></i> Teléfonos
            </dt>
            <dd>
              <a href={CONTACTO.phoneHref}>{CONTACTO.phones[0]}</a>
              {" · "}
              <a href="tel:+582125051406">{CONTACTO.phones[1]}</a>
            </dd>
          </div>
        </dl>

        <div className="uneti-mapa-sede__acciones">
          <a
            href={sede.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-medium btn-dark-gray btn-rounded btn-switch-text"
          >
            <span>
              <span className="btn-double-text" data-text="Ver en Google Maps">
                Ver en Google Maps
              </span>
              <span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </span>
            </span>
          </a>
          <a
            href={comoLlegar}
            target="_blank"
            rel="noreferrer"
            className="uneti-mapa-sede__ruta"
          >
            Cómo llegar
            <i className="bi bi-signpost-split" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
