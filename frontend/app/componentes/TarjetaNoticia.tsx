import type { Noticia } from "../lib/noticias";

export default function TarjetaNoticia({ noticia }: { noticia: Noticia }) {
  const href = `/noticias/${noticia.slug}`;

  return (
    <article className="uneti-noticia-card card border-0 border-radius-6px overflow-hidden box-shadow-large h-100">
      <div className="blog-image position-relative overflow-hidden">
        <a href={href} aria-label={noticia.titulo}>
          <img src={noticia.imagen} alt={noticia.imagenAlt} loading="lazy" />
        </a>
        <span className="uneti-noticia-categoria">{noticia.categoria}</span>
      </div>
      <div className="card-body p-30px sm-p-25px d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between fs-14 text-uppercase fw-600 mb-15px">
          <time dateTime={noticia.fechaISO} className="text-medium-gray">
            {noticia.fecha}
          </time>
          <span className="text-base-color">{noticia.tiempoLectura}</span>
        </div>
        <h3 className="card-title fw-600 fs-20 lh-28 text-dark-gray mb-15px">
          <a href={href} className="text-dark-gray">
            {noticia.titulo}
          </a>
        </h3>
        <p className="mb-20px flex-grow-1">{noticia.resumen}</p>
        <div className="d-flex align-items-center justify-content-between border-top border-color-extra-medium-gray pt-20px">
          <span className="d-flex align-items-center">
            <img
              src={noticia.autor.avatar}
              className="w-40px h-40px rounded-circle me-10px"
              alt={noticia.autor.nombre}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <span className="fs-14 fw-600 text-dark-gray">{noticia.autor.nombre}</span>
          </span>
          <a href={`${href}#comentarios`} className="fs-14 text-dark-gray fw-600">
            <i className="fa-regular fa-comment me-5px"></i>
            {noticia.comentarios}
          </a>
        </div>
      </div>
    </article>
  );
}
