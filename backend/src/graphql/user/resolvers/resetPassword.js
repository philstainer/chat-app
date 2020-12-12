import { UserInputError } from 'apollo-server-express';
import { hash } from 'bcryptjs';

import { User } from '#graphql/user/user.model';
import { selectedFields } from '#utils/selectedFields';
import { isNotAuthenticated } from '#utils/isNotAuthenticated';
import {
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '#utils/helpers';
import { INVALID_TOKEN_ERROR, REFRESH_TOKEN } from '#config/constants';

export const resetPassword = async (parent, args, ctx, info) => {
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
  const password = await hash(args?.input?.password, 10);

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
};
