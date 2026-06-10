import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getClient() {
  // Use the internal Docker URL for SSR/RSC, and the public URL for CSR
  const uri = typeof window === "undefined"
    ? process.env.WORDPRESS_GRAPHQL_URL
    : process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: uri,
      // Pass cookies/headers if needed in the future
    }),
  });
}
