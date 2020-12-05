import { AuthenticationError } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { accessEnv } from './accessEnv';
import { AUTH_LOGGED_OUT_ERROR } from './constants';

export const wsAuthentication = (webSocket) => {
  return new Promise((resolve, reject) => {
    const { cookie } = webSocket.upgradeReq.headers;

    const cookies = cookie?.split(';').reduce((obj, curr) => {
      const [name, value] = curr.trim().split('=');

      return { ...obj, [name]: unescape(value) };
    }, {});

    const decodedCookie = cookieParser.signedCookie(
      cookies?.token,
      accessEnv('BACKEND_COOKIE_SECRET')
    );

    const jwtToken = jwt.verify(decodedCookie, accessEnv('JWT_SECRET'));

    if (!Types.ObjectId.isValid(jwtToken?.sub))
      reject(new AuthenticationError(AUTH_LOGGED_OUT_ERROR));

    resolve(jwtToken.sub);
  });
};
