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
  // Throw error when refresh token doesn't exist
  const token = ctx?.req?.signedCookies?.[REFRESH_TOKEN];
  if (!token) throw new AuthenticationError(INVALID_REFRESH_TOKEN_ERROR);

  // Throw error when decoded access token is not expired
  const decodedAccessToken = await decodeAsync(ctx.token);
  const isExpired = Date.now() >= decodedAccessToken.exp * 1000;
  if (!isExpired) throw new AuthenticationError(TOKEN_NOT_EXPIRED);

  // Throw error when refresh token doesn't exist and clear cookie
  const foundRefreshToken = await RefreshToken.findOne({ token }).populate(
    'user'
  );
  if (!foundRefreshToken || !foundRefreshToken.isActive) {
    ctx.res.clearCookie(REFRESH_TOKEN);

    throw new AuthenticationError(INVALID_REFRESH_TOKEN_ERROR);
  }

  // Generate new refresh token and revoke old one
  const { user } = foundRefreshToken;
  const ipAddress = ctx?.req.ip;
  const newRefreshToken = await generateRefreshToken(user, ipAddress);

  foundRefreshToken.revoked = Date.now();
  foundRefreshToken.revokedByIp = ipAddress;
  foundRefreshToken.replacedByToken = newRefreshToken.token;

  await foundRefreshToken.save();

  // Generate new access token and set refresh token cookie
  const newAccessToken = await signAsync({ sub: user._id });

  setCookie(REFRESH_TOKEN, newRefreshToken.token, ctx.res);

  // Return created access token
  return {
    token: newAccessToken,
  };
};
