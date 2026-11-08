import ContadorAnimado from "./ContadorAnimado";
import IndicadorEnLinea from "./IndicadorEnLinea";
import MediaHeroParallax, { type DiapositivaHero } from "./MediaHeroParallax";

const HERO_STATS = [
  { value: 2, suffix: "", label: "PNF académicos" },
  { value: 7000, suffix: "+", label: "Estudiantes" },
  { value: 100, suffix: "%", label: "Educación gratuita" },
];

const HERO_SLIDES: DiapositivaHero[] = [
  {
    desktopSrc: "/assets/images/uneti/contacto-estudiantes.webp",
    mobileSrc: "/assets/images/uneti/contacto-estudiantes-mobile.webp",
    alt: "Estudiantes de la UNETI durante una actividad académica",
    width: 1280,
    height: 960,
    posicion: "50% 38%",
  },
  {
    desktopSrc: "/assets/images/uneti/FotoGrupalCurso3.jpg",
    alt: "Participantes de un curso de formación de la UNETI",
    width: 570,
    height: 600,
    posicion: "50% 32%",
  },
  {
    desktopSrc: "/assets/images/uneti/EquipoDeDesarrolloDeSoftware.jpg",
    alt: "Equipo de desarrollo de software de la UNETI",
    width: 896,
    height: 1195,
    posicion: "50% 28%",
  },
  {
    desktopSrc: "/assets/images/uneti/DiLorenzoEnseña.jpg",
    alt: "Docente de la UNETI durante una clase",
    width: 896,
    height: 1196,
    posicion: "50% 26%",
  },
];

export default function PortadaPrincipal() {
  return (
    <section id="hero" className="uneti-hero">
      <MediaHeroParallax slides={HERO_SLIDES} velocidad={0.1} intervalo={5000} />
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
                <div className="uneti-modality-card">
                  <span className="uneti-modality-card__icon" aria-hidden="true">
                    <i className="bi bi-laptop"></i>
                  </span>
                  <div>
                    <strong>Educación Multimodal / Híbrida</strong>
                    <span>Encuentros presenciales y mediación digital</span>
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
