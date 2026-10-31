import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabeceraNoticia from "../../componentes/CabeceraNoticia";
import CuadriculaNoticias from "../../componentes/CuadriculaNoticias";
import EncabezadoSitio from "../../componentes/EncabezadoSitio";
import PieSitio from "../../componentes/PieSitio";
import SeccionComentarios from "../../componentes/SeccionComentarios";
import {
  obtenerNoticiaPorSlug,
  obtenerNoticias,
  obtenerNoticiasRelacionadas,
} from "../../lib/noticias";

type PropiedadesNoticia = {
  params: Promise<{ slug: string }>;
};

const BASE_PUBLICA = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uneti.edu.ve").replace(
  /\/$/,
  "",
);

// Los detalles leen `params` para resolver el slug; se declaran bloqueantes
// para cumplir con la validación de URL data de Next.js 16.
export const instant = false;

export async function generateStaticParams() {
  const noticias = await obtenerNoticias(50, 300);
  return noticias.map((noticia) => ({ slug: noticia.slug }));
}

export async function generateMetadata({
  params,
}: PropiedadesNoticia): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await obtenerNoticiaPorSlug(slug);

  if (!noticia) {
    return { title: "Noticia no encontrada | UNETI" };
  }

  return {
    title: `${noticia.titulo} | UNETI Noticias`,
    description: noticia.resumen,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen,
      images: [{ url: noticia.imagen }],
    },
  };
}

export default async function DetalleNoticiaPage({ params }: PropiedadesNoticia) {
  const { slug } = await params;
  const noticia = await obtenerNoticiaPorSlug(slug);

  if (!noticia) {
    notFound();
  }

  const relacionadas = await obtenerNoticiasRelacionadas(noticia.slug, 3);
  const urlCompartir = `${BASE_PUBLICA}/noticias/${noticia.slug}`;

  return (
    <>
      <EncabezadoSitio />
      <main>
        <CabeceraNoticia noticia={noticia} />

        <section className="pb-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <p className="alt-font text-dark-gray fw-600 ls-minus-1px w-90 md-w-100 mb-30px fs-20 lh-30">
                  {noticia.resumen}
                </p>
                <div
                  className="uneti-noticia-contenido last-paragraph-no-margin"
                  dangerouslySetInnerHTML={{ __html: noticia.contenidoHtml }}
                />
              </div>

              <div className="col-lg-9">
                <div className="row align-items-center border-top border-bottom border-color-extra-medium-gray pt-20px pb-20px mt-40px">
                  <div className="col-md-7 text-center text-md-start md-mb-15px">
                    <span className="d-inline-block fw-600 text-dark-gray me-10px">
                      Etiquetas:
                    </span>
                    {(noticia.etiquetas.length > 0
                      ? noticia.etiquetas
                      : [noticia.categoria]
                    ).map((etiqueta) => (
                      <a
                        href="/noticias"
                        key={etiqueta}
                        className="d-inline-block fs-14 fw-600 text-uppercase border border-color-extra-medium-gray border-radius-30px ps-15px pe-15px pt-5px pb-5px me-5px mb-5px"
                      >
                        {etiqueta}
                      </a>
                    ))}
                  </div>
                  <div className="col-md-5 text-center text-md-end">
                    <span className="d-inline-block fw-600 text-dark-gray me-10px">
                      Compartir:
                    </span>
                    <a
                      className="text-dark-gray me-10px"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        urlCompartir,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Compartir en Facebook"
                    >
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a
                      className="text-dark-gray"
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        noticia.titulo,
                      )}&url=${encodeURIComponent(urlCompartir)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Compartir en X"
                    >
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-30px pb-30px">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="bg-very-light-gray border-radius-6px p-40px sm-p-25px">
                  <div className="row align-items-center">
                    <div className="col-md-auto text-center mb-20px md-mb-0">
                      <img
                        src={noticia.autor.avatar}
                        className="rounded-circle w-100px"
                        alt={noticia.autor.nombre}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="col-md text-center text-md-start last-paragraph-no-margin">
                      <span className="d-block alt-font fs-19 fw-600 text-dark-gray">
                        {noticia.autor.nombre}
                      </span>
                      <span className="d-block fs-14 text-uppercase fw-600 mb-10px">
                        {noticia.categoria} · {noticia.tiempoLectura}
                      </span>
                      <p className="mb-0">{noticia.autor.descripcion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SeccionComentarios
          slug={noticia.slug}
          comentariosAbiertos={noticia.comentariosAbiertos}
        />

        <section className="bg-gradient-tranquil-white">
          <div className="container">
            <div className="row justify-content-center align-items-center mb-4 text-center">
              <div className="col-12">
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-0">
                  Noticias relacionadas
                </h2>
              </div>
            </div>
            <CuadriculaNoticias noticias={relacionadas} />
            <div className="row justify-content-center mt-5">
              <div className="col-auto">
                <a
                  href="/noticias"
                  className="btn btn-large btn-dark-gray btn-box-shadow btn-rounded btn-switch-text"
                >
                  <span>
                    <span className="btn-double-text" data-text="Volver a todas las noticias">
                      Volver a todas las noticias
                    </span>
                    <span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieSitio />
    </>
  );
}
