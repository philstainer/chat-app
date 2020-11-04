import { AuthenticationError } from 'apollo-server-express';

import { logger } from './logger';
import { AUTH_LOGGED_OUT_ERROR } from './constants';

const isAuthenticated = (ctx) => {
  if (!ctx?.res?.userId) {
    logger.error(AUTH_LOGGED_OUT_ERROR);
    throw new AuthenticationError(AUTH_LOGGED_OUT_ERROR);
  }
};

export { isAuthenticated };
