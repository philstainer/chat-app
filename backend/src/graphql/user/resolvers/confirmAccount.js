import { UserInputError } from 'apollo-server-express';

import { User } from '#graphql/user/user.model';
import { INVALID_TOKEN_ERROR } from '#config/constants';

export const confirmAccount = async (parent, args, ctx, info) => {
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
};
