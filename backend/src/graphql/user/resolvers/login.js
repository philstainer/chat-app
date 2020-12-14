import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';

import { User } from '#graphql/user/user.model';
import { generateRefreshToken } from '#utils/generateRefreshToken';
import { signAsync } from '#utils/jwt';
import { setCookie } from '#utils/setCookie';
import { USER_NOT_FOUND_ERROR, REFRESH_TOKEN } from '#config/constants';

export const login = async (parent, args, ctx, info) => {
  const foundUser = await User.findOne({
    $or: [
      { email: args?.input?.emailOrUsername },
      { username: args?.input?.emailOrUsername },
    ],
  })
    .select(`_id password`)
    .lean();
  if (!foundUser) throw new AuthenticationError(USER_NOT_FOUND_ERROR);

  const isValid = await bcrypt.compare(
    args?.input?.password,
    foundUser.password
  );
  if (!isValid) throw new AuthenticationError(USER_NOT_FOUND_ERROR);

  // Generate tokens and set cookie
  const ipAddress = ctx.req.ip;

  const token = await signAsync({ sub: foundUser._id });
  const refreshToken = await generateRefreshToken(foundUser, ipAddress);

  setCookie(REFRESH_TOKEN, refreshToken.token, ctx.res);

  return {
    token,
  };
};
