import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import ejs from 'ejs';
import path from 'path';
import sgMail from '@sendgrid/mail';

import { userController } from './user.controller';
import { User } from './user.modal';

import { generateCookie } from '../../utils/generateCookie';
import { isNotAuthenticated } from '../../utils/isNotAuthenticated';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import {
  USER_NOT_FOUND_ERROR,
  USER_CONFIRM_ACCOUNT_ERROR,
} from '../../utils/constants';
import { accessEnv } from '../../utils/accessEnv';

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

      // Generate and send email
      const html = await ejs.renderFile(
        path.join(__dirname, '../../templates/confirm-account.ejs'),
        {
          URL: `${ctx?.req?.protocol}://${ctx?.req?.get('host')}`,
          CODE: createdUser.verifyToken,
        }
      );

      await sgMail.send({
        to: createdUser.email,
        from: accessEnv('SENDGRID_API_FROM'),
        subject: 'Account confirmation',
        html,
      });

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
    confirmAccount: async (parent, args, ctx, info) => {
      const foundUser = await User.findOne({
        verifyToken: args?.input?.token,
      })
        .select('_id')
        .lean();

      if (!foundUser) throw new UserInputError(USER_CONFIRM_ACCOUNT_ERROR);

      await User.findByIdAndUpdate(foundUser._id, {
        verified: true,
        verifyToken: null,
      });

      return true;
    },
  },
};

export { userResolver };
