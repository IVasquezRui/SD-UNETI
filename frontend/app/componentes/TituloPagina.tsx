import type { ReactNode } from "react";
import FondoParallaxCabecera from "./FondoParallaxCabecera";
import ParticulasDecorativas from "./ParticulasDecorativas";

type MigaPan = {
  label: string;
  href?: string;
};

type PropiedadesTituloPagina = {
  title: string;
  subtitle?: string;
  image?: string;
  imagePosition?: string;
  crumbs?: MigaPan[];
  children?: ReactNode;
  particleId?: string;
  /** Sustituye el fondo estático por una capa con parallax. */
  parallax?: boolean;
  /**
   * `cover` (por defecto) recorta la foto para llenar el hero.
   * `completo` muestra la fotografía entera sobre una copia desenfocada que
   * rellena el resto: útil con fotos verticales o cuadradas donde el recorte
   * dejaría fuera al sujeto.
   */
  imageFit?: "cover" | "completo";
  /** Altura extra para heroes con fotografías poco panorámicas. */
  imageHeight?: "normal" | "alto";
};

export default function TituloPagina({
  title,
  subtitle,
  image,
  imagePosition = "center",
  crumbs,
  children,
  particleId = "page-title-particles",
  parallax = false,
  imageFit = "cover",
  imageHeight = "normal",
}: PropiedadesTituloPagina) {
  const fondo = image ?? "/assets/images/uneti/nosotros-principal.webp";
  const mostrarCompleto = imageFit === "completo" && !parallax;

  return (
    <section
      className={`uneti-page-header${imageHeight === "alto" ? " uneti-page-header--alto" : ""}`}
      style={
        parallax || mostrarCompleto
          ? undefined
          : {
              backgroundPosition: imagePosition,
              backgroundImage: `url(${fondo})`,
            }
      }
    >
      {mostrarCompleto && (
        <div className="uneti-page-header__encuadre" aria-hidden="true">
          <div
            className="uneti-page-header__desenfoque"
            style={{ backgroundImage: `url(${fondo})` }}
          ></div>
          <img
            className="uneti-page-header__media uneti-page-header__media--completo"
            src={fondo}
            alt=""
            style={{ objectPosition: imagePosition }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      )}
      {parallax && <FondoParallaxCabecera src={fondo} posicion={imagePosition} />}
      <div className="uneti-page-header__overlay" aria-hidden="true"></div>
      <ParticulasDecorativas id={particleId} className="uneti-page-header__particles" />

      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-8 col-lg-9 col-md-10 position-relative">
            <div className="uneti-page-header__content">
              {crumbs && crumbs.length > 0 && (
                <nav className="uneti-page-header__crumbs" aria-label="Migas de pan">
                  {crumbs.map((crumb, index) => (
                    <span key={crumb.label}>
                      {index > 0 && <span aria-hidden="true">•</span>}
                      {crumb.href ? (
                        <a href={crumb.href}>{crumb.label}</a>
                      ) : (
                        <span aria-current="page">{crumb.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
              )}
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
