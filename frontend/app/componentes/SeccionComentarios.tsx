"use client";

import { useState, type FormEvent } from "react";
import { useComentarios } from "../hooks/useComentarios";

function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Caracas",
  }).format(fecha);
}

export default function SeccionComentarios({
  slug,
  comentariosAbiertos,
}: {
  slug: string;
  comentariosAbiertos: boolean;
}) {
  const { comentarios, cargando, error, enviando, enviarComentario } = useComentarios(slug);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contenido, setContenido] = useState("");
  const [publicado, setPublicado] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const ok = await enviarComentario(nombre, correo, contenido);
    if (ok) {
      setNombre("");
      setCorreo("");
      setContenido("");
      setPublicado(true);
    }
  }

  return (
    <section id="comentarios" className="pt-0">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="bg-very-light-gray border-radius-6px p-40px sm-p-25px">
              <div className="d-flex align-items-center justify-content-between mb-30px">
                <div>
                  <span className="uneti-section-eyebrow mb-10px">Conversación</span>
                  <h2 className="alt-font text-dark-gray fw-600 ls-minus-2px mb-0">
                    Comentarios ({comentarios.length})
                  </h2>
                </div>
                <i className="bi bi-chat-square-text fs-40 text-base-color d-none d-sm-block"></i>
              </div>

              {comentariosAbiertos ? (
                <form onSubmit={manejarEnvio} className="mb-40px">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label
                        className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
                        htmlFor="comentario-nombre"
                      >
                        Nombre*
                      </label>
                      <input
                        id="comentario-nombre"
                        className="form-control border-radius-0px border-color-extra-medium-gray bg-white"
                        value={nombre}
                        onChange={(evento) => setNombre(evento.target.value)}
                        placeholder="Tu nombre"
                        maxLength={80}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
                        htmlFor="comentario-correo"
                      >
                        Correo (opcional)
                      </label>
                      <input
                        id="comentario-correo"
                        type="email"
                        className="form-control border-radius-0px border-color-extra-medium-gray bg-white"
                        value={correo}
                        onChange={(evento) => setCorreo(evento.target.value)}
                        placeholder="tu@correo.com"
                        maxLength={120}
                      />
                    </div>
                    <div className="col-12">
                      <label
                        className="form-label fs-14 text-uppercase text-dark-gray fw-600 mb-0"
                        htmlFor="comentario-contenido"
                      >
                        Comentario*
                      </label>
                      <textarea
                        id="comentario-contenido"
                        className="form-control border-radius-0px border-color-extra-medium-gray bg-white"
                        rows={4}
                        value={contenido}
                        onChange={(evento) => setContenido(evento.target.value)}
                        placeholder="Comparte tu opinión sobre esta noticia"
                        maxLength={2000}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 d-flex flex-wrap align-items-center justify-content-between gap-2">
                      <p className="mb-0 fs-14">
                        Tu comentario se guarda como texto plano en WordPress.
                      </p>
                      <button
                        type="submit"
                        className="btn btn-medium btn-dark-gray btn-rounded btn-switch-text"
                        disabled={enviando}
                      >
                        <span>
                          <span className="btn-double-text" data-text="Publicar comentario">
                            {enviando ? "Publicando..." : "Publicar comentario"}
                          </span>
                          <span>
                            <i className="fa-regular fa-paper-plane"></i>
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <div aria-live="polite">
                    {publicado && (
                      <p className="text-success mt-15px mb-0">
                        Comentario publicado. Gracias por participar.
                      </p>
                    )}
                    {error && <p className="text-danger mt-15px mb-0">{error}</p>}
                  </div>
                </form>
              ) : (
                <p className="mb-30px">Los comentarios están cerrados para esta noticia.</p>
              )}

              {cargando ? (
                <p className="mb-0">Cargando comentarios…</p>
              ) : comentarios.length === 0 ? (
                <p className="mb-0">Sé la primera persona en comentar esta noticia.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {comentarios.map((comentario) => (
                    <li
                      key={comentario.id}
                      className="bg-white border-radius-6px p-25px mb-15px box-shadow-large"
                    >
                      <div className="d-flex align-items-start">
                        {comentario.avatar ? (
                          <img
                            src={comentario.avatar}
                            alt={comentario.nombre}
                            className="w-50px h-50px rounded-circle me-15px"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="uneti-comentario-avatar me-15px">
                            {comentario.nombre.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap align-items-center justify-content-between mb-5px">
                            <span className="fw-600 text-dark-gray">{comentario.nombre}</span>
                            <time
                              dateTime={comentario.fechaISO}
                              className="fs-13 text-medium-gray"
                            >
                              {formatearFecha(comentario.fechaISO)}
                            </time>
                          </div>
                          <p className="mb-0 uneti-comentario-texto">{comentario.contenido}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
