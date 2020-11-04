import { userController } from './user.controller';
import { generateCookie } from '../../utils/generateCookie';
import { isNotAuthenticated } from '../../utils/isNotAuthenticated';

const userResolver = {
  Mutation: {
    register: async (parent, args, ctx, info) => {
      isNotAuthenticated(ctx);

      const createdUser = await userController.createUser(args);

      generateCookie({ sub: createdUser._id }, 'token', ctx);

      return createdUser;
    },
  },
};

export { userResolver };
