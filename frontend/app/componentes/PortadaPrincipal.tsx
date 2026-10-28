import ContadorAnimado from "./ContadorAnimado";
import IndicadorEnLinea from "./IndicadorEnLinea";

const HERO_STATS = [
  { value: 2, suffix: "", label: "PNF académicos" },
  { value: 7000, suffix: "+", label: "Estudiantes" },
  { value: 100, suffix: "%", label: "Educación gratuita" },
];

export default function PortadaPrincipal() {
  return (
    <section id="hero" className="uneti-hero">
      <img
        src="/assets/images/uneti/hero-uneti.webp"
        alt="Egresados y estudiantes de la UNETI compartiendo en un encuentro académico"
        className="uneti-hero__media"
        width={1246}
        height={864}
        loading="eager"
        decoding="async"
      />
      <div className="uneti-hero__shade" aria-hidden="true"></div>
      <div className="uneti-hero__grid" aria-hidden="true"></div>
      <div className="uneti-hero__particles" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="container uneti-hero__container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-7 col-md-12">
            <div className="uneti-hero__content">
              <span className="uneti-section-eyebrow text-white mb-20px">
                Bienvenidos y bienvenidas a la UNETI
              </span>

              <h1 className="uneti-hero__title">
                Formamos.
                <br />
                <span>Innovamos.</span>
              </h1>

              <p className="uneti-hero__lead">
                Somos la Universidad de la innovación y la creatividad. Formamos profesionales en
                telecomunicaciones, informática y tecnologías emergentes para la soberanía
                tecnológica de Venezuela.
              </p>

              <div className="uneti-hero__actions">
                <a href="/nosotros" className="uneti-btn uneti-btn--primary">
                  Conoce la UNETI
                  <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
                </a>
                <a href="/carreras" className="uneti-btn uneti-btn--ghost">
                  Explora las carreras
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </a>
              </div>

              <div className="uneti-hero__meta">
                <div className="uneti-online-card">
                  <span className="uneti-online-card__icon" aria-hidden="true">
                    <i className="bi bi-globe2"></i>
                  </span>
                  <div>
                    <strong>100% online</strong>
                    <span>Formación gratuita y a tu ritmo</span>
                  </div>
                </div>
                <IndicadorEnLinea cantidad={1240} />
              </div>

              <div className="uneti-hero__stats">
                {HERO_STATS.map((stat) => (
                  <div className="uneti-hero__stat" key={stat.label}>
                    <ContadorAnimado
                      valor={stat.value}
                      sufijo={stat.suffix}
                      className="uneti-hero__stat-value"
                    />
                    <span className="uneti-hero__stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <a href="/admisiones" className="uneti-hero__admission">
                ¿Listo para dar el siguiente paso? Inicia tu admisión
                <i className="bi bi-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
