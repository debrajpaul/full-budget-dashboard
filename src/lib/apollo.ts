import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const apiUrl = import.meta.env.VITE_API_URL ?? 'https://uzovyc6sl5.execute-api.ap-south-1.amazonaws.com/dev/graphql';

const httpLink = createHttpLink({
  uri: apiUrl,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('jwt') : null;

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error('[GraphQL error]', err.message);
    }
  }

  if (networkError) {
    console.error('[Network error]', networkError);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
