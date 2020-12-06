import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const isDevelopment = process.env.NODE_ENV === 'development';

export const cache = new InMemoryCache();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;

const httpLink = new HttpLink({
  uri: BACKEND_HOST,
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: BACKEND_HOST.replace(/(https|http)/, 'ws'),
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache,
  connectToDevTools: isDevelopment,
});
