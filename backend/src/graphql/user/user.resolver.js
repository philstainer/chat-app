import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import ejs from 'ejs';
import path from 'path';
import sgMail from '@sendgrid/mail';

import { userController } from './user.controller';
import { User } from './user.modal';

import { generateCookie } from '../../utils/generateCookie';
import { generateToken } from '../../utils/generateToken';
import { isNotAuthenticated } from '../../utils/isNotAuthenticated';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import {
  USER_NOT_FOUND_ERROR,
  INVALID_TOKEN_ERROR,
} from '../../utils/constants';
import { accessEnv } from '../../utils/accessEnv';

const userResolver = {
  Query: {
    me: async (parent, args, ctx, info) => {
      if (!ctx?.req?.userId) return null;

      const selected = selectedFields(info);

      const foundUser = await User.findById(ctx?.req?.userId)
        .select(selected)
        .lean();

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
          URL: accessEnv('FRONTEND_URI'),
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

      if (!foundUser) throw new UserInputError(INVALID_TOKEN_ERROR);

      await User.findByIdAndUpdate(foundUser._id, {
        verified: true,
        verifyToken: null,
      });

      return true;
    },
    resetPasswordRequest: async (parent, args, ctx, info) => {
      isNotAuthenticated(ctx);

      // Ignore users with resetToken that hasn't expired
      const foundUser = await User.findOne({
        email: args?.input?.email,
        $or: [
          { resetTokenExpiry: null },
          { resetTokenExpiry: { $lte: Date.now() } },
        ],
      })
        .select('_id')
        .lean();

      if (foundUser) {
        // Generate Token and expiry
        const resetToken = await generateToken();
        const resetTokenExpiry = Date.now() + 1 * 60 * 15 * 1000; // 15 Minutes

        // Update User
        await User.findByIdAndUpdate(foundUser._id, {
          resetToken,
          resetTokenExpiry,
        });

        // Generate and send reset email
        const html = await ejs.renderFile(
          path.join(__dirname, '../../templates/reset-password.ejs'),
          {
            URL: accessEnv('FRONTEND_URI'),
            TOKEN: resetToken,
          }
        );

        await sgMail.send({
          to: args?.input?.email,
          from: accessEnv('SENDGRID_API_FROM'),
          subject: 'Reset Password',
          html,
        });
      }

      return true;
    },
    resetPassword: async (parent, args, ctx, info) => {
      isNotAuthenticated(ctx);

      // Find user with non expired token
      const foundUser = await User.findOne({
        resetToken: args?.input?.token,
        resetTokenExpiry: { $gte: Date.now() },
      })
        .select('_id')
        .lean();

      if (!foundUser) throw new UserInputError(INVALID_TOKEN_ERROR);

      // Generate selected fields
      const selected = selectedFields(info);

      // Hash password
      const password = await bcrypt.hash(args?.input?.password, 10);

      // Update user with new password
      const updatedUser = await User.findByIdAndUpdate(
        foundUser?._id,
        { password, resetToken: null, resetTokenExpiry: null },
        { new: true }
      )
        .select(selected)
        .lean();

      generateCookie({ sub: updatedUser?._id }, 'token', ctx);

      return updatedUser;
    },
  },
};

export { userResolver };
