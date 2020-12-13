import { randomBytes } from 'crypto';

export const randomTokenString = (length = 40) => {
  return randomBytes(length).toString('hex');
};
