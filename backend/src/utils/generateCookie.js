import jwt from 'jsonwebtoken';
import { accessEnv } from './accessEnv';

const generateCookie = (data, name, ctx, options) => {
  const token = jwt.sign(data, accessEnv('JWT_SECRET'));

  const cookieOptions = {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
    secure: accessEnv('NODE_ENV') === 'production',
    signed: true,
    ...options,
  };

  ctx.req.cookie(name, token, cookieOptions);
};

export { generateCookie };