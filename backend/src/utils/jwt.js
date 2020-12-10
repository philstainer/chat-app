import jwt from 'jsonwebtoken';

import { accessEnv } from './accessEnv';

export const defaultOptions = {
  issuer: 'chat-app',
  expiresIn: '15m',
};

export const signJWT = (payload, options) => {
  const secret = accessEnv('JWT_SECRET');

  const jwtOptions = { ...defaultOptions, ...options };

  return jwt.sign(payload, secret, jwtOptions);
};

export const verifyJWT = (token, options) => {
  const secret = accessEnv('JWT_SECRET');

  const jwtOptions = { ...defaultOptions, ...options };

  try {
    return jwt.verify(token, secret, jwtOptions);
  } catch (error) {
    return false;
  }
};

export const decodeJWT = token => jwt.decode(token, { complete: true });
