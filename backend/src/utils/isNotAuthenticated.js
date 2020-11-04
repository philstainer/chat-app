import { AuthenticationError } from 'apollo-server-express';

import { logger } from './logger';

const isNotAuthenticated = (ctx) => {
  const userId = ctx?.res?.userId;

  if (userId) {
    logger.error(`${userId} - You are already logged in`);
    throw new AuthenticationError('You are already logged in');
  }
};

export { isNotAuthenticated };
