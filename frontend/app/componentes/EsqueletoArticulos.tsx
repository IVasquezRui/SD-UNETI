/** Marcador de posición con la misma retícula de las tarjetas de noticias. */
export default function EsqueletoArticulos() {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" aria-hidden="true">
      {[0, 1, 2].map((indice) => (
        <div className="col" key={indice}>
          <div className="uneti-esqueleto-card">
            <span className="uneti-esqueleto-media"></span>
            <span className="uneti-esqueleto-linea"></span>
            <span className="uneti-esqueleto-linea"></span>
            <span className="uneti-esqueleto-linea uneti-esqueleto-linea--corta"></span>
            <span className="uneti-esqueleto-pie"></span>
          </div>
        </div>
      ))}
    </div>
  );
}
