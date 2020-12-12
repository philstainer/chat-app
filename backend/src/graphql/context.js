import { loaders } from '#graphql/loaders';

import { ACCESS_TOKEN } from '#config/constants';
import { verifyJwtToken } from '#utils/helpers';

export const context = async ({ connection, payload, ...ctx }) => {
  const token = ctx?.req?.headers?.[ACCESS_TOKEN] || payload?.token;
  const verifiedToken = await verifyJwtToken(token);

  if (connection)
    return {
      ...(verifiedToken && { userId: verifiedToken.sub }),
      ...loaders(),
    };

  return {
    ...ctx,
    ...(verifiedToken && { userId: verifiedToken.sub }),
    ...loaders(),
  };
};
