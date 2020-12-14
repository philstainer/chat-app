import { HttpLink, split, ApolloLink, from } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import jwtDecode from 'jwt-decode';

import { BACKEND_HOST, ACCESS_TOKEN } from './utils/constants';
import { accessToken } from './cache';

const httpLink = new HttpLink({
  uri: BACKEND_HOST,
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: BACKEND_HOST.replace(/(https|http)/, 'ws'),
  options: {
    reconnect: true,
    lazy: true,
  },
});

const subscriptionMiddleware = {
  applyMiddleware: (options, next) => {
    // eslint-disable-next-line no-param-reassign
    options.token = accessToken();

    next();
  },
};

wsLink.subscriptionClient.use([subscriptionMiddleware]);

const authMiddleware = new ApolloLink((operation, forward) => {
  const { token } = operation.getContext();

  operation.setContext(() => ({
    headers: {
      [ACCESS_TOKEN]: token ? `Bearer ${token}` : '',
    },
  }));

  return forward(operation);
});

export const refreshToken = async token => {
  const request = await fetch(BACKEND_HOST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [ACCESS_TOKEN]: token },
    credentials: 'include',
    body: JSON.stringify({
      query: 'query refreshTokens { refreshTokens { token } }',
    }),
  });

  return request.json();
};

const withToken = setContext(async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (token) {
    const { exp } = jwtDecode(token);

    const expirationTime = exp * 1000;

    if (Date.now() >= expirationTime) {
      const { data, errors } = await refreshToken(token);

      // Logged out completely when refresh token is invalid
      if (errors?.[0].message.match(/refresh token invalid or expired/i)) {
        localStorage.removeItem(ACCESS_TOKEN);

        wsLink.subscriptionClient.close();

        accessToken(null);

        return null;
      }

      // Set new access token
      const newToken = data.refreshTokens.token;

      localStorage.setItem(ACCESS_TOKEN, newToken);

      accessToken(newToken);

      return {
        token: newToken,
      };
    }
  }

  return { token };
});

export const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  from([withToken, authMiddleware.concat(httpLink)])
);
