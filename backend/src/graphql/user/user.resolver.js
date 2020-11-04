import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';

import { userController } from './user.controller';
import { User } from './user.modal';

import { generateCookie } from '../../utils/generateCookie';
import { isNotAuthenticated } from '../../utils/isNotAuthenticated';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import { USER_NOT_FOUND_ERROR } from '../../utils/constants';

const userResolver = {
  Query: {
    me: async (parent, args, ctx, info) => {
      isAuthenticated(ctx);

      const selected = selectedFields(info);

      const foundUser = await User.findById(ctx?.req?.userId)
        .select(selected)
        .lean();

      if (!foundUser) throw new AuthenticationError(USER_NOT_FOUND_ERROR);

      return foundUser;
    },
  },
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
    logout: (parent, args, ctx, info) => {
      isAuthenticated(ctx);

      ctx.res.clearCookie('token');

      return true;
    },
  },
};

export { userResolver };
