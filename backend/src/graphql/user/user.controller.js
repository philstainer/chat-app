import bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-express';

import { generateToken } from '../../utils/generateToken';
import { User } from './user.modal';
import { logger } from '../../utils/logger';
import { USER_EMAIL_ALREADY } from '../../utils/constants';

const userController = {
  createUser: async (args) => {
    const foundUser = await User.findOne({ email: args.input.email })
      .select('email')
      .lean();

    if (foundUser) {
      logger.error(USER_EMAIL_ALREADY);
      throw new AuthenticationError(USER_EMAIL_ALREADY);
    }

    const password = await bcrypt.hash(args.input.password, 10);

    const verifyToken = await generateToken();

    const createdUser = User.create({
      ...args.input,
      password,
      verifyToken,
    });

    return createdUser;
  },
};

export { userController };
