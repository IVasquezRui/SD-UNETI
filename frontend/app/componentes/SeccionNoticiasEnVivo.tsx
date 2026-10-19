"use client";

import type { Noticia } from "../lib/noticias";
import { useNoticiasEnVivo } from "../hooks/useNoticiasEnVivo";
import CuadriculaNoticias from "./CuadriculaNoticias";

export default function SeccionNoticiasEnVivo({
  noticiasIniciales,
  limite,
}: {
  noticiasIniciales: Noticia[];
  limite?: number;
}) {
  const { noticias, conectado } = useNoticiasEnVivo(noticiasIniciales, limite);

  return (
    <div className="uneti-noticias-vivo">
      <div className="d-flex justify-content-end mb-15px">
        <span className={`uneti-vivo-indicador${conectado ? " is-online" : ""}`}>
          <span className="uneti-vivo-punto"></span>
          {conectado ? "Actualización en vivo" : "Conectando…"}
        </span>
      </div>
      <CuadriculaNoticias noticias={noticias} />
    </div>
  );
}
