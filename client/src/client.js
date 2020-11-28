import { ApolloClient, InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URI,
  cache,
});
