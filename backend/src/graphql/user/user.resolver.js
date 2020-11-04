import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';

import { userController } from './user.controller';
import { generateCookie } from '../../utils/generateCookie';
import { isNotAuthenticated } from '../../utils/isNotAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import { User } from './user.modal';
import { USER_NOT_FOUND_ERROR } from '../../utils/constants';

const userResolver = {
  Mutation: {
    register: async (parent, args, ctx, info) => {
      isNotAuthenticated(ctx);

      const createdUser = await userController.createUser(args);

      generateCookie({ sub: createdUser._id }, 'token', ctx);

      return createdUser;
    },
    login: async (parent, args, ctx, info) => {
      isNotAuthenticated(ctx);

      const selected = selectedFields(info);

      const foundUser = await User.findOne({ email: args?.input?.email })
        .select(`${selected} password`)
        .lean();

      if (!foundUser) throw new AuthenticationError(USER_NOT_FOUND_ERROR);

      const isValid = await bcrypt.compare(
        args?.input?.password,
        foundUser?.password
      );

      if (!isValid) throw new AuthenticationError(USER_NOT_FOUND_ERROR);

      generateCookie({ sub: foundUser._id }, 'token', ctx);

      return foundUser;
    },
  },
};

export { userResolver };
