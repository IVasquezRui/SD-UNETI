/**
 * Cliente GraphQL mínimo sobre fetch nativo (sin dependencias).
 * Endpoint interno del contenedor WordPress en docker-compose.
 *
 * TODO: definir WP_GRAPHQL_URL en el entorno del servicio next_frontend.
 */
const WP_GRAPHQL_ENDPOINT =
  process.env.WP_GRAPHQL_URL ?? "http://wp_site:8080/graphql";

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  try {
    const response = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 },
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

/**
 * Consultas de referencia. Ajustar los nombres raíz si el CPT `curso` se
 * registra con otro `graphql_plural_name` en WordPress.
 */
export const COURSES_QUERY = /* GraphQL */ `
  query Courses {
    cursos(first: 100) {
      nodes {
        slug
        title
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const POSTS_QUERY = /* GraphQL */ `
  query Posts {
    posts(first: 12) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

export const POST_BY_SLUG_QUERY = /* GraphQL */ `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      slug
      title
      content
      date
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          name
        }
      }
    }
  }
`;
