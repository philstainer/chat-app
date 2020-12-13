import { AuthenticationError } from 'apollo-server-express';

import { RefreshToken } from '#graphql/user/refreshToken.model';
import { generateRefreshToken } from '#utils/generateRefreshToken';
import { setCookie } from '#utils/setCookie';
import { decodeAsync, signAsync } from '#utils/jwt';
import {
  INVALID_REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN,
  TOKEN_NOT_EXPIRED,
} from '#config/constants';

export const refreshTokens = async (parent, args, ctx, info) => {
  const ipAddress = ctx?.req?.ip;

  const token = ctx?.req?.signedCookies?.[REFRESH_TOKEN];
  if (!token) throw new AuthenticationError(INVALID_REFRESH_TOKEN_ERROR);

  const decodedToken = await decodeAsync(ctx?.token);
  const isExpired = Date.now() >= decodedToken.exp * 1000;
  if (!isExpired) throw new AuthenticationError(TOKEN_NOT_EXPIRED);

  const refreshToken = await RefreshToken.findOne({ token }).populate('user');
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

  const jwtToken = await signAsync({ sub: user._id });

  setCookie(REFRESH_TOKEN, newRefreshToken.token, ctx?.res);

  return {
    token: jwtToken,
  };
};
