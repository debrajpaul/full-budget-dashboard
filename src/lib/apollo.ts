// src/lib/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "https://uzovyc6sl5.execute-api.ap-south-1.amazonaws.com/dev/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("jwt");
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
  }));
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) console.error("[GraphQL error]", err.message);
  }
  if (networkError) console.error("[Network error]", networkError);
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transactions: {
            keyArgs: ["filters"],
            merge(existing = { items: [], cursor: null }, incoming) {
              return {
                items: [...(existing?.items ?? []), ...(incoming?.items ?? [])],
                cursor: incoming?.cursor ?? null,
              };
            },
          },
        },
      },
    },
  }),
});
