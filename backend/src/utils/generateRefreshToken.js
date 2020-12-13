import ms from 'ms';

import { RefreshToken } from '#graphql/user/refreshToken.model';
import { randomTokenString } from '#utils/randomTokenString';

export const generateRefreshToken = (user, ipAddress) => {
  return RefreshToken.create({
    user: user._id,
    token: randomTokenString(),
    expires: Date.now() + ms('7d'),
    createdByIp: ipAddress,
  });
};
