/**
 * Cliente GraphQL mínimo sobre fetch nativo.
 *
 * En Docker se usa el DNS interno `http://wordpress/graphql`; fuera de Docker
 * (build local, pruebas) se usa el puerto publicado en localhost.
 */
const WP_GRAPHQL_ENDPOINT =
  process.env.WP_GRAPHQL_URL ?? "http://localhost:8080/graphql";

/** URL base de WordPress para la REST API propia (comentarios). */
export const WP_REST_URL = (process.env.WP_INTERNAL_URL ?? "http://localhost:8080").replace(
  /\/$/,
  "",
);

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

type RequestOptions = {
  /**
   * Fuerza una lectura sin caché (SSE, polling).
   * En el modelo de Cache Components la caché se declara con `use cache` en el
   * cargador; aquí solo se marca la excepción en tiempo de petición.
   */
  sinCache?: boolean;
};

export async function consultarGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  { sinCache = false }: RequestOptions = {},
): Promise<T | null> {
  try {
    const response = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      ...(sinCache ? { cache: "no-store" as RequestCache } : {}),
    });

    if (!response.ok) {
      console.error(`[WPGraphQL] HTTP ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as GraphQLResponse<T>;
    if (payload.errors?.length) {
      console.error("[WPGraphQL]", payload.errors.map((error) => error.message).join(" | "));
      return null;
    }

    return payload.data ?? null;
  } catch (error) {
    console.error("[WPGraphQL] request failed", error);
    return null;
  }
}

/** Campos compartidos por el listado y el detalle de noticias. */
export const NOTICIAS_QUERY = /* GraphQL */ `
  query Noticias($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        slug
        title
        excerpt
        content
        date
        commentCount
        commentStatus
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
          }
        }
        tags {
          nodes {
            name
          }
        }
        author {
          node {
            name
            description
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

export const NOTICIA_QUERY = /* GraphQL */ `
  query Noticia($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      slug
      title
      excerpt
      content
      date
      commentCount
      commentStatus
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
        }
      }
      tags {
        nodes {
          name
        }
      }
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
    }
  }
`;

/** Consulta ligera usada por el stream SSE: solo lo necesario para detectar cambios. */
export const NOTICIAS_STREAM_QUERY = /* GraphQL */ `
  query NoticiasStream {
    posts(first: 24, where: { status: PUBLISH }) {
      nodes {
        slug
        title
        date
        commentCount
      }
    }
  }
`;

export type RawNoticia = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  commentCount: number;
  commentStatus: "open" | "closed";
  featuredImage: { node: { sourceUrl: string; altText: string | null } } | null;
  categories: { nodes: { name: string }[] };
  tags: { nodes: { name: string }[] };
  author: {
    node: {
      name: string;
      description: string | null;
      avatar: { url: string } | null;
    };
  } | null;
};

export type RawNoticiasResponse = {
  posts: { nodes: RawNoticia[] };
};

export type RawNoticiaResponse = {
  post: RawNoticia | null;
};
