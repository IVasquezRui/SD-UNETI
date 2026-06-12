import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getClient() {
  // Use the internal Docker URL for SSR/RSC, and the public URL for CSR
  const uri = typeof window === "undefined"
    ? process.env.WORDPRESS_GRAPHQL_URL || process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || "http://wordpress/graphql"
    : process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || process.env.WORDPRESS_GRAPHQL_URL || "http://wp.uneti.local/graphql";

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri,
      // Pass cookies/headers if needed in the future
    }),
  });
}
