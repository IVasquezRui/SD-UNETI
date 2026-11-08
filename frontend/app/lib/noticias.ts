import { cacheLife, cacheTag } from "next/cache";
import {
  NOTICIAS_QUERY,
  NOTICIA_QUERY,
  NOTICIAS_STREAM_QUERY,
  consultarGraphQL,
  type RawNoticia,
  type RawNoticiaResponse,
  type RawNoticiasResponse,
} from "./wordpress";

export type AutorNoticia = {
  nombre: string;
  descripcion: string;
  avatar: string;
};

export type Noticia = {
  slug: string;
  titulo: string;
  resumen: string;
  contenidoHtml: string;
  categoria: string;
  etiquetas: string[];
  fecha: string;
  fechaISO: string;
  tiempoLectura: string;
  comentarios: number;
  comentariosAbiertos: boolean;
  imagen: string;
  imagenAlt: string;
  autor: AutorNoticia;
};

export type ResumenNoticia = {
  slug: string;
  titulo: string;
  fecha: string;
  comentarios: number;
};

const IMAGEN_RESPALDO = "/assets/images/uneti/nosotros-principal.webp";
const AVATAR_RESPALDO = "/assets/images/uneti/testimonio-juan.webp";

const ENTIDADES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "’",
  "&#8230;": "…",
  "&nbsp;": " ",
};

function decodificarEntidades(texto: string): string {
  return texto
    .replace(/&#(\d+);/g, (_, codigo: string) => String.fromCodePoint(Number(codigo)))
    .replace(/&[a-z]+;/gi, (entidad) => ENTIDADES[entidad] ?? entidad);
}

export function limpiarHtml(html: string): string {
  return decodificarEntidades(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function calcularTiempoLectura(html: string): string {
  const palabras = limpiarHtml(html).split(/\s+/).filter(Boolean).length;
  const minutos = Math.max(1, Math.round(palabras / 200));
  return `${minutos} min de lectura`;
}

function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;

  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(fecha);
}

function mapearNoticia(raw: RawNoticia): Noticia {
  const contenidoHtml = raw.content ?? "";
  const resumen = limpiarHtml(raw.excerpt || contenidoHtml).slice(0, 240);

  return {
    slug: raw.slug,
    titulo: limpiarHtml(raw.title),
    resumen,
    contenidoHtml,
    categoria: raw.categories.nodes[0]?.name ?? "Actualidad",
    etiquetas: raw.tags.nodes.map((tag) => tag.name),
    fecha: formatearFecha(raw.date),
    fechaISO: raw.date,
    tiempoLectura: calcularTiempoLectura(contenidoHtml),
    comentarios: raw.commentCount ?? 0,
    comentariosAbiertos: raw.commentStatus === "open",
    imagen: raw.featuredImage?.node.sourceUrl ?? IMAGEN_RESPALDO,
    imagenAlt: raw.featuredImage?.node.altText || limpiarHtml(raw.title),
    autor: {
      nombre: raw.author?.node.name ?? "Redacción UNETI",
      descripcion:
        raw.author?.node.description ||
        "Equipo de Comunicaciones de la Universidad Nacional Experimental de las Telecomunicaciones e Informática.",
      avatar: raw.author?.node.avatar?.url ?? AVATAR_RESPALDO,
    },
  };
}

export async function obtenerNoticias(limite = 12): Promise<Noticia[]> {
  "use cache";
  cacheLife("noticias");
  cacheTag("noticias");

  const data = await consultarGraphQL<RawNoticiasResponse>(NOTICIAS_QUERY, {
    first: Math.min(Math.max(limite, 1), 100),
  });

  return data?.posts.nodes.map(mapearNoticia) ?? [];
}

export async function obtenerNoticiaPorSlug(slug: string): Promise<Noticia | null> {
  "use cache";
  cacheLife("noticias");
  cacheTag("noticias", `noticia-${slug}`);

  const data = await consultarGraphQL<RawNoticiaResponse>(NOTICIA_QUERY, { slug });

  return data?.post ? mapearNoticia(data.post) : null;
}

export async function obtenerNoticiasRelacionadas(
  slug: string,
  limite = 3,
): Promise<Noticia[]> {
  const noticias = await obtenerNoticias(30);
  return noticias.filter((noticia) => noticia.slug !== slug).slice(0, limite);
}

/**
 * Lectura sin caché para el stream SSE y el polling del navegador: estos
 * canales necesitan detectar cambios en WordPress en cada ciclo.
 */
export async function obtenerNoticiasEnVivo(limite = 50): Promise<Noticia[]> {
  const data = await consultarGraphQL<RawNoticiasResponse>(
    NOTICIAS_QUERY,
    { first: Math.min(Math.max(limite, 1), 100) },
    { sinCache: true },
  );

  return data?.posts.nodes.map(mapearNoticia) ?? [];
}

export async function consultarResumenNoticias(): Promise<ResumenNoticia[]> {
  const data = await consultarGraphQL<RawNoticiasResponse>(
    NOTICIAS_STREAM_QUERY,
    undefined,
    { sinCache: true },
  );

  return (
    data?.posts.nodes.map((noticia) => ({
      slug: noticia.slug,
      titulo: noticia.title,
      fecha: noticia.date,
      comentarios: noticia.commentCount ?? 0,
    })) ?? []
  );
}
