import { loaders } from '#graphql/loaders';

import { ACCESS_TOKEN } from '#config/constants';
import { verifyAsync } from '#utils/jwt';

export const context = async ({ connection, payload, ...ctx }) => {
  const token = ctx?.req?.headers?.[ACCESS_TOKEN] || payload?.token;

  const other = {};

  if (token) {
    other.token = token?.replace('Bearer ', '');

    try {
      const { sub } = await verifyAsync(other.token);
      other.userId = sub;
    } catch (error) {}
  }

  if (connection)
    return {
      ...other,
      ...loaders(),
    };

  return {
    ...ctx,
    ...other,
    ...loaders(),
  };
};
