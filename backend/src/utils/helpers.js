import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import ms from 'ms';

import { RefreshToken } from '../graphql/user/refreshToken.model';
import { accessEnv } from './accessEnv';

export const randomTokenString = (length = 40) => {
  return randomBytes(length).toString('hex');
};

export const hashPassword = async password => {
  const hashedPassword = await hash(password, 10);

  return hashedPassword;
};

export const setTokenCookie = (name, token, res) => {
  const isProduction = accessEnv('NODE_ENV') === 'production';

  const cookieOptions = {
    httpOnly: true,
    maxAge: ms('7d'),
    secure: isProduction,
    signed: true,
  };

  res.cookie(name, token, cookieOptions);
};

export const generateRefreshToken = (user, ipAddress) => {
  return RefreshToken.create({
    user: user._id,
    token: randomTokenString(),
    expires: Date.now() + ms('7d'),
    createdByIp: ipAddress,
  });
};

export const generateJwtToken = user => {
  const secret = accessEnv('JWT_SECRET');

  return new Promise((resolve, reject) => {
    try {
      resolve(
        sign({ sub: user._id }, secret, {
          issuer: 'chat-app',
          expiresIn: '15m',
        })
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyJwtToken = token => {
  const secret = accessEnv('JWT_SECRET');
  const jwtToken = token?.replace('Bearer ', '');

  return new Promise(resolve => {
    try {
      resolve(
        verify(jwtToken, secret, {
          issuer: 'chat-app',
          expiresIn: '15m',
        })
      );
    } catch (error) {
      resolve(false);
    }
  });
};
