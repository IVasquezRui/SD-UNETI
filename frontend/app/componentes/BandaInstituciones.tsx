const ALIADOS = [
  { nombre: "ABAE", archivo: "abae.png" },
  { nombre: "Industria Canaima", archivo: "industria-canaima.png" },
  { nombre: "CANTV", archivo: "cantv.png" },
  { nombre: "CNTI", archivo: "cnti.png" },
  { nombre: "CONATI", archivo: "conati.png" },
  { nombre: "Fundación Infocentro", archivo: "ifocentro.png" },
  { nombre: "FII", archivo: "fii.png" },
  { nombre: "Ipostel", archivo: "ipostel.png" },
  { nombre: "Movilnet", archivo: "movilnet.png" },
  { nombre: "Orinoquía", archivo: "orinoquia.png" },
  { nombre: "Suscerte", archivo: "suscerte.png" },
  { nombre: "CONATEL", archivo: "conatel.png" },
];

function GrupoAliados({ copia }: { copia: boolean }) {
  return (
    <div className="uneti-partner-group" aria-hidden={copia || undefined}>
      {ALIADOS.map((aliado) => (
        <figure className="uneti-partner-card" key={`${copia ? "b" : "a"}-${aliado.archivo}`}>
          <img
            src={`/assets/images/instituciones/${aliado.archivo}`}
            alt={`${aliado.nombre} — institución aliada de la UNETI`}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{aliado.nombre}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function BandaInstituciones() {
  return (
    <section className="uneti-partner-band" aria-labelledby="uneti-aliados-title">
      <div className="container">
        <div className="uneti-partner-band__intro">
          <span className="uneti-section-eyebrow mb-10px">Red de aliados</span>
          <h2 id="uneti-aliados-title" className="alt-font text-dark-gray fw-600 mb-0">
            Instituciones que impulsan nuestro ecosistema
          </h2>
          <p className="mb-0">
            Articulamos formación, investigación y desarrollo con organizaciones del sector
            tecnológico y de telecomunicaciones.
          </p>
        </div>
      </div>
      <div className="uneti-partner-marquee">
        <div className="uneti-partner-track">
          <GrupoAliados copia={false} />
          <GrupoAliados copia />
        </div>
      </div>
    </section>
  );
}
