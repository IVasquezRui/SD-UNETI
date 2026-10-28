"use client";

import { useEffect, useRef, useState } from "react";

type PropiedadesBotonVideo = {
  videoId: string;
  titulo?: string;
  etiqueta?: string;
};

export default function BotonVideo({
  videoId,
  titulo = "Video de UNETI Educativo",
  etiqueta = "Reproducir video de UNETI Educativo",
}: PropiedadesBotonVideo) {
  const [abierto, setAbierto] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const boton = botonRef.current;
    const alPresionarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAbierto(false);
    };

    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", alPresionarTecla);

    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.style.overflow = overflowPrevio;
      boton?.focus();
    };
  }, [abierto]);

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        className="uneti-video-play"
        onClick={() => setAbierto(true)}
        aria-label={etiqueta}
        aria-haspopup="dialog"
        aria-expanded={abierto}
      >
        <i className="fa-solid fa-play" aria-hidden="true"></i>
      </button>

      {abierto && (
        <div
          className="uneti-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAbierto(false);
          }}
        >
          <div className="uneti-video-modal__panel">
            <button
              type="button"
              className="uneti-video-modal__close"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar video"
              autoFocus
            >
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
            <div className="uneti-video-modal__ratio">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
