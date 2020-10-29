import bcrypt from 'bcryptjs';

import { generateToken } from '../../utils/generateToken';
import { User } from './user.modal';

export const expiresAt = Date.now() + 1 * 60 * 60 * 1000;

const userController = {
  createUser: async (args) => {
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
