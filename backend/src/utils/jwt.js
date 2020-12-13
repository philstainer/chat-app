import { promisify } from 'util';
import { verify, sign, decode } from 'jsonwebtoken';

import { accessEnv } from '#utils/accessEnv';

export const defaultOptions = {
  issuer: 'chat-app',
  expiresIn: '15m',
};

export const signAsync = (payload, args) => {
  const secret = accessEnv('JWT_SECRET');

  const options = { ...defaultOptions, ...args };

  return promisify(sign)(payload, secret, options);
};

export const verifyAsync = (jwt, args) => {
  const secret = accessEnv('JWT_SECRET');

  const options = { ...defaultOptions, ...args };

  return promisify(verify)(jwt, secret, options);
};

export const decodeAsync = (token, args) => {
  return new Promise(resolve => {
    const decoded = decode(token, args);

    resolve(decoded);
  });
};
