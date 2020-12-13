import { ApolloError } from 'apollo-server-express';
import { hash } from 'bcryptjs';

import { User } from '#graphql/user/user.model';
import { generateRefreshToken } from '#utils/generateRefreshToken';
import { randomTokenString } from '#utils/randomTokenString';
import { registrationEmail } from '#utils/notifications';
import { signAsync } from '#utils/jwt';
import { setCookie } from '#utils/setCookie';
import { logger } from '#utils/logger';
import { REFRESH_TOKEN, GENERAL_ERROR } from '#config/constants';

export const register = async (parent, args, ctx, info) => {
  try {
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

    const token = await signAsync({ sub: createdUser?._id });
    const refreshToken = await generateRefreshToken(createdUser, ipAddress);

    setCookie(REFRESH_TOKEN, refreshToken?.token, ctx?.res);

    await registrationEmail(
      createdUser?.email,
      verifyToken,
      createdUser?.username
    );

    return {
      token,
    };
  } catch (error) {
    logger.error(error);
    throw new ApolloError(GENERAL_ERROR);
  }
};
