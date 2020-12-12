import { AuthenticationError } from 'apollo-server-express';

import { RefreshToken } from '#graphql/user/refreshToken.model';
import {
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '#utils/helpers';
import { INVALID_REFRESH_TOKEN_ERROR, REFRESH_TOKEN } from '#config/constants';

export const refreshTokens = async (parent, args, ctx, info) => {
  const ipAddress = ctx?.req?.ip;
  const token = ctx?.req?.signedCookies?.[REFRESH_TOKEN];

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

  const jwtToken = await generateJwtToken(user);

  setTokenCookie(REFRESH_TOKEN, newRefreshToken.token, ctx?.res);

  return {
    token: jwtToken,
  };
};
