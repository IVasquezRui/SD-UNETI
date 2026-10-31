"use client";

import { useRef, type CSSProperties } from "react";
import { useParallax } from "../hooks/useParallax";

type PropiedadesParallaxImagen = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  velocidad?: number;
  loading?: "lazy" | "eager";
};

/** Imagen con desplazamiento parallax suave; el contenedor debe recortarla. */
export default function ParallaxImagen({
  src,
  alt,
  className = "",
  width,
  height,
  velocidad = 0.06,
  loading = "lazy",
}: PropiedadesParallaxImagen) {
  const ref = useRef<HTMLImageElement>(null);
  useParallax(ref, { velocidad });

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`uneti-parallax-img ${className}`.trim()}
      style={{ "--parallax-y": "0px" } as CSSProperties}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
    />
  );
}
