"use client";

import type { CSSProperties } from "react";

type PropiedadesSolicitarCupo = {
  slug: string;
  nombre: string;
  color: string;
  variante?: "solido" | "ghost";
  className?: string;
};

/**
 * Enlace "Solicitar Cupo" de un posgrado.
 *
 * Lleva al formulario al final de `/posgrados` y preselecciona el programa.
 * Sin JavaScript el enlace sigue funcionando: el ancla y el query string
 * bastan para llegar al formulario correcto.
 */
export default function SolicitarCupo({
  slug,
  nombre,
  color,
  variante = "solido",
  className = "",
}: PropiedadesSolicitarCupo) {
  const href = `/posgrados?posgrado=${encodeURIComponent(slug)}#formulario-posgrados`;

  return (
    <a
      href={href}
      className={`uneti-solicitar-cupo uneti-solicitar-cupo--${variante} ${className}`.trim()}
      style={{ "--posgrado-color": color } as CSSProperties}
      aria-label={`Solicitar Cupo para ${nombre}`}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("uneti:posgrado", { detail: slug }));
      }}
    >
      Solicitar Cupo
      <i className="bi bi-arrow-right" aria-hidden="true"></i>
    </a>
  );
}
