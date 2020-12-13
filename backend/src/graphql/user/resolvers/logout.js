export const logout = async (parent, args, ctx, info) => {
  ctx.res.clearCookie('token');

  return true;
};
