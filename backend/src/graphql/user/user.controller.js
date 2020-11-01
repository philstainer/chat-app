import bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-express';

import { generateToken } from '../../utils/generateToken';
import { User } from './user.modal';
import { logger } from '../../utils/logger';

export const expiresAt = Date.now() + 1 * 60 * 60 * 1000;

const userController = {
  createUser: async (args) => {
    const foundUser = await User.findOne({ email: args.email })
      .select('email')
      .lean();

    if (foundUser) {
      logger.error('Email Already registered');
      throw new AuthenticationError('Email already registered');
    }

    const password = await bcrypt.hash(args.password, 10);

    const verifyToken = await generateToken();

    const createdUser = User.create({
      ...args,
      password,
      verifyToken,
      verifyTokenExpiry: expiresAt,
    });

    return createdUser;
  },
};

export { userController };
