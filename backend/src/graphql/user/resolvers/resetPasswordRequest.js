import ms from 'ms';

import { User } from '#graphql/user/user.model';
import { randomTokenString } from '#utils/helpers';
import { resetPasswordEmail } from '#utils/notifications';

export const resetPasswordRequest = async (parent, args, ctx, info) => {
  // Ignore users with resetToken that hasn't expired
  const foundUser = await User.findOne({
    email: args?.input?.email,
    $or: [
      { resetTokenExpiry: null },
      { resetTokenExpiry: { $lte: Date.now() } },
    ],
  })
    .select('_id email username')
    .lean();

  if (foundUser) {
    // Generate Token and expiry
    const resetToken = randomTokenString();
    const resetTokenExpiry = Date.now() + ms('15m'); // 15 Minutes

    // Update User
    await User.findByIdAndUpdate(foundUser._id, {
      resetToken,
      resetTokenExpiry,
    });

    await resetPasswordEmail(foundUser?.email, resetToken, foundUser?.username);
  }

  return true;
};
