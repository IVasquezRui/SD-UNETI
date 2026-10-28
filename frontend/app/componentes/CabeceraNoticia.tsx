import type { Noticia } from "../lib/noticias";
import ParticulasDecorativas from "./ParticulasDecorativas";

export default function CabeceraNoticia({ noticia }: { noticia: Noticia }) {
  return (
    <section
      className="uneti-article-header"
      style={{ backgroundImage: `url(${noticia.imagen})` }}
    >
      <div className="uneti-article-header__overlay" aria-hidden="true"></div>
      <ParticulasDecorativas id="article-header-particles" className="uneti-article-header__particles" />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 position-relative">
            <div className="uneti-article-header__content">
              <div className="uneti-article-header__meta">
                <time dateTime={noticia.fechaISO}>{noticia.fecha}</time>
                <span aria-hidden="true">•</span>
                <a href="/noticias">{noticia.categoria}</a>
                <span aria-hidden="true">•</span>
                <span>{noticia.tiempoLectura}</span>
              </div>
              <h1>{noticia.titulo}</h1>
              <div className="uneti-article-header__author">
                <img
                  src={noticia.autor.avatar}
                  alt={noticia.autor.nombre}
                  width={80}
                  height={80}
                  referrerPolicy="no-referrer"
                />
                <span>
                  Por{" "}
                  <a href="/noticias">{noticia.autor.nombre}</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
