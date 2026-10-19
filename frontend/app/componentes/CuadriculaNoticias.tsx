import type { Noticia } from "../lib/noticias";
import TarjetaNoticia from "./TarjetaNoticia";

export default function CuadriculaNoticias({
  noticias,
  vacio = "Todavía no hay noticias publicadas.",
}: {
  noticias: Noticia[];
  vacio?: string;
}) {
  if (noticias.length === 0) {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center bg-white border-radius-6px p-40px box-shadow-large">
          <i className="bi bi-newspaper fs-40 text-base-color d-block mb-15px"></i>
          <p className="mb-0">{vacio}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {noticias.map((noticia) => (
        <div className="col" key={noticia.slug}>
          <TarjetaNoticia noticia={noticia} />
        </div>
      ))}
    </div>
  );
}
