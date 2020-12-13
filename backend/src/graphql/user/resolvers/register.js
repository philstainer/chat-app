import { hash } from 'bcryptjs';

import { User } from '#graphql/user/user.model';
import {
  randomTokenString,
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '#utils/helpers';
import { registrationEmail } from '#utils/notifications';
import { REFRESH_TOKEN } from '#config/constants';

export const register = async (parent, args, ctx, info) => {
  // Create User
  const password = await hash(args?.input?.password, 10);
  const verifyToken = randomTokenString();

  const createdUser = await User.create({
    ...args?.input,
    password,
    verifyToken,
  });

  // Generate tokens and set cookie
  const ipAddress = ctx?.req?.ip;

  const token = await generateJwtToken(createdUser);
  const refreshToken = await generateRefreshToken(createdUser, ipAddress);

  setTokenCookie(REFRESH_TOKEN, refreshToken?.token, ctx?.res);

  await registrationEmail(
    createdUser?.email,
    verifyToken,
    createdUser?.username
  );

  return {
    token,
  };
};
