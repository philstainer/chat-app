import { isAuthenticated } from '#utils/isAuthenticated';

export const logout = async (parent, args, ctx, info) => {
  isAuthenticated(ctx);

  ctx.res.clearCookie('token');

  return true;
};
