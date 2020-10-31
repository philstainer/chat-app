import { AuthenticationError } from 'apollo-server-express';

import { logger } from '../../utils/logger';
import { userController } from './user.controller';
import { generateCookie } from '../../utils/generateCookie';

const userResolver = {
  Mutation: {
    signUp: async (parent, args, ctx, info) => {
      const userId = ctx?.req?.userId;

      if (userId) {
        logger.error(`${userId} - You are already logged in!`);
        throw new AuthenticationError('you are already logged in');
      }

      const createdUser = await userController.createUser(args);

      generateCookie({ sub: createdUser._id }, 'token', ctx);

      return createdUser;
    },
  },
};

export { userResolver };
