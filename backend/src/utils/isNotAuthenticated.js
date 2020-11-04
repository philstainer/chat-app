import { AuthenticationError } from 'apollo-server-express';

import { logger } from './logger';
import { AUTH_LOGGED_IN_ERROR } from './constants';

const isNotAuthenticated = (ctx) => {
  const userId = ctx?.req?.userId;

  if (userId) {
    logger.error(`${userId} - ${AUTH_LOGGED_IN_ERROR}`);
    throw new AuthenticationError(AUTH_LOGGED_IN_ERROR);
  }
};

export { isNotAuthenticated };
