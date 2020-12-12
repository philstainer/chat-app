import { AuthenticationError } from 'apollo-server-express';

import { logger } from '#utils/logger';
import { AUTH_LOGGED_OUT_ERROR } from '#config/constants';

const isAuthenticated = ctx => {
  if (!ctx?.userId) {
    logger.error(AUTH_LOGGED_OUT_ERROR);
    throw new AuthenticationError(AUTH_LOGGED_OUT_ERROR);
  }
};

export { isAuthenticated };
