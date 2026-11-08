import type { MetadataRoute } from "next";
import { CARRERAS } from "./lib/carreras";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uneti.edu.ve").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { ruta: "", prioridad: 1 },
    { ruta: "/nosotros", prioridad: 0.8 },
    { ruta: "/carreras", prioridad: 0.9 },
    { ruta: "/posgrados", prioridad: 0.9 },
    { ruta: "/cursos", prioridad: 0.7 },
    { ruta: "/noticias", prioridad: 0.7 },
    { ruta: "/admisiones", prioridad: 0.8 },
    { ruta: "/contacto", prioridad: 0.6 },
    { ruta: "/privacidad", prioridad: 0.3 },
  ];

  const estaticas: MetadataRoute.Sitemap = rutas.map(({ ruta, prioridad }) => ({
    url: `${BASE}${ruta}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: prioridad,
  }));

  const carreras: MetadataRoute.Sitemap = CARRERAS.map((carrera) => ({
    url: `${BASE}/carreras/${carrera.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...estaticas, ...carreras];
}
