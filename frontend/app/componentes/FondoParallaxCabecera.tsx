"use client";

import { useRef, type CSSProperties } from "react";
import { useParallax } from "../hooks/useParallax";

type PropiedadesFondo = {
  src: string;
  alt?: string;
  posicion?: string;
};

/** Capa de imagen del hero interno con parallax y encuadre configurable. */
export default function FondoParallaxCabecera({
  src,
  alt = "",
  posicion = "center",
}: PropiedadesFondo) {
  const ref = useRef<HTMLImageElement>(null);
  useParallax(ref, { velocidad: 0.07 });

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? "true" : undefined}
      className="uneti-page-header__media"
      style={
        {
          "--parallax-y": "0px",
          objectPosition: posicion,
        } as CSSProperties
      }
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}
