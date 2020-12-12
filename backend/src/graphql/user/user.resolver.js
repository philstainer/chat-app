import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import ms from 'ms';
import { notifications } from '../../utils/notifications';

import { RefreshToken } from './refreshToken.model';
import { User } from './user.model';

import {
  hashPassword,
  randomTokenString,
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '../../utils/helpers';

import { isNotAuthenticated } from '../../utils/isNotAuthenticated';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import {
  USER_NOT_FOUND_ERROR,
  INVALID_TOKEN_ERROR,
  INVALID_REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN,
  GENERAL_ERROR,
} from '../../config/constants';
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
        return {
          __typename: 'SystemError',
          message: GENERAL_ERROR,
        };
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

      const verificationLink = `${accessEnv(
        'FRONTEND_URI'
      )}/verify/${verifyToken}`;
      await notifications.registrationEmail(
        createdUser?.email,
        verificationLink,
        'test'
      );

      return {
        __typename: 'Token',
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
        .select('_id email username')
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

        const emailLink = `${accessEnv('FRONTEND_URI')}/reset/${resetToken}`;
        await notifications.resetPasswordEmail(
          foundUser?.email,
          emailLink,
          foundUser?.username
        );
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
