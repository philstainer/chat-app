import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';

import { User } from '#graphql/user/user.model';
import { selectedFields } from '#utils/selectedFields';
import { isNotAuthenticated } from '#utils/isNotAuthenticated';
import {
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '#utils/helpers';
import { USER_NOT_FOUND_ERROR, REFRESH_TOKEN } from '#config/constants';

export const login = async (parent, args, ctx, info) => {
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
};
