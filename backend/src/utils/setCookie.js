import ms from 'ms';

import { accessEnv } from '#utils/accessEnv';

export const setCookie = (name, token, res, args) => {
  const isProduction = accessEnv('NODE_ENV') === 'production';

  const cookieOptions = {
    httpOnly: true,
    maxAge: ms('7d'),
    secure: isProduction,
    signed: true,
    ...args,
  };

  res.cookie(name, token, cookieOptions);
};
