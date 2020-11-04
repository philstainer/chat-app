import jwt from 'jsonwebtoken';
import { accessEnv } from './accessEnv';

const getUserIdentity = (req, res, next) => {
  if (req?.signedCookies?.token) {
    const { sub } = jwt.verify(
      req.signedCookies.token,
      accessEnv('JWT_SECRET')
    );

    req.userId = sub;
  }

  next();
};

export { getUserIdentity };
