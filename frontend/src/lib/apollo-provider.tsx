"use client";

import { ApolloProvider } from "@apollo/client";
import { getClient } from "./apollo-client";

// This component is only needed if you use Client Components that need to fetch data.
// For Server Components (RSC), use getClient() directly.
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = getClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
