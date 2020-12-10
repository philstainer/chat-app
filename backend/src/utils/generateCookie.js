import jwt from 'jsonwebtoken';
import ms from 'ms';
import { accessEnv } from './accessEnv';

const generateCookie = (data, name, ctx, options) => {
  const isProduction = accessEnv('NODE_ENV') === 'production';

  const token = jwt.sign(data, accessEnv('JWT_SECRET'));

  const cookieOptions = {
    httpOnly: true,
    maxAge: ms('7d'),
    secure: isProduction,
    signed: true,
    ...options,
  };

  ctx.res.cookie(name, token, cookieOptions);
};

export { generateCookie };
