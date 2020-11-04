import { AuthenticationError } from 'apollo-server-express';

import { logger } from './logger';

const errorMessage = 'You must be logged in to do that';

const isAuthenticated = (ctx) => {
  if (!ctx?.res?.userId) {
    logger.error(errorMessage);
    throw new AuthenticationError(errorMessage);
  }
};

export { isAuthenticated };
