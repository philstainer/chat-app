import { User } from '#graphql/user/user.model';
import { selectedFields } from '#utils/selectedFields';

export const me = async (parent, args, ctx, info) => {
  if (!ctx?.userId) return null;

  const selected = selectedFields(info);

  const foundUser = await User.findById(ctx?.userId).select(selected).lean();

  return foundUser;
};
