import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import ejs from 'ejs';
import path from 'path';
import sgMail from '@sendgrid/mail';
import ms from 'ms';

import { RefreshToken } from './refreshToken.model';
import { User } from './user.model';

import {
  hashPassword,
  randomTokenString,
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '../../utils/helpers';

import { logger } from '../../utils/logger';
import { isNotAuthenticated } from '../../utils/isNotAuthenticated';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import {
  USER_NOT_FOUND_ERROR,
  INVALID_TOKEN_ERROR,
  INVALID_REFRESH_TOKEN_ERROR,
  USER_FOUND_ERROR,
  REFRESH_TOKEN,
} from '../../utils/constants';
import { accessEnv } from '../../utils/accessEnv';

const userResolver = {
  Query: {
    me: async (parent, args, ctx, info) => {
      if (!ctx?.userId) return null;

      const selected = selectedFields(info);

      const foundUser = await User.findById(ctx?.userId)
        .select(selected)
        .lean();

      return foundUser;
    },
    refreshTokens: async (parent, args, ctx, info) => {
      const ipAddress = ctx?.req?.ip;
      const token = ctx?.req?.signedCookies?.[REFRESH_TOKEN];

      const refreshToken = await RefreshToken.findOne({ token }).populate(
        'user'
      );
      if (!refreshToken || !refreshToken.isActive) {
        ctx.res.clearCookie(REFRESH_TOKEN);

        throw new AuthenticationError(INVALID_REFRESH_TOKEN_ERROR);
      }

      const { user } = refreshToken;

      const newRefreshToken = await generateRefreshToken(user, ipAddress);

      refreshToken.revoked = Date.now();
      refreshToken.revokedByIp = ipAddress;
      refreshToken.replacedByToken = newRefreshToken.token;

      await refreshToken.save();

      const jwtToken = await generateJwtToken(user);

      setTokenCookie(REFRESH_TOKEN, newRefreshToken.token, ctx?.res);

      return {
        token: jwtToken,
      };
    },
  },
  Mutation: {
    register: async (parent, args, ctx, info) => {
      isNotAuthenticated(ctx);

      // Check if email exists
      const foundUser = await User.findOne({ email: args?.input?.email })
        .select('email')
        .lean();

      if (foundUser) {
        logger.error(USER_FOUND_ERROR);
        throw new AuthenticationError(USER_FOUND_ERROR);
      }

      // Create User
      const password = await hashPassword(args?.input?.password);
      const verifyToken = randomTokenString();

      const createdUser = await User.create({
        ...args?.input,
        password,
        verifyToken,
      });

      // Generate tokens and set cookie
      const ipAddress = ctx?.req?.ip;

      const token = await generateJwtToken(createdUser);
      const refreshToken = await generateRefreshToken(createdUser, ipAddress);

      setTokenCookie(REFRESH_TOKEN, refreshToken?.token, ctx?.res);

      // Generate and send email
      const html = await ejs.renderFile(
        path.join(__dirname, '../../templates/confirm-account.ejs'),
        {
          URL: accessEnv('FRONTEND_URI'),
          CODE: createdUser?.verifyToken,
        }
      );

      await sgMail.send({
        to: createdUser?.email,
        from: accessEnv('SENDGRID_API_FROM'),
        subject: 'Account confirmation',
        html,
      });

      return {
        token,
      };
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

      // Generate tokens and set cookie
      const ipAddress = ctx?.req?.ip;

      const token = await generateJwtToken(foundUser);
      const refreshToken = await generateRefreshToken(foundUser, ipAddress);

      setTokenCookie(REFRESH_TOKEN, refreshToken?.token, ctx?.res);

      return {
        token,
      };
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
        const resetToken = randomTokenString();
        const resetTokenExpiry = Date.now() + ms('15m'); // 15 Minutes

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

      // Generate tokens and set cookie
      const ipAddress = ctx?.req?.ip;

      const token = await generateJwtToken(updatedUser);
      const refreshToken = await generateRefreshToken(updatedUser, ipAddress);

      setTokenCookie(REFRESH_TOKEN, refreshToken?.token, ctx?.res);

      return {
        token,
      };
    },
  },
};

export { userResolver };
