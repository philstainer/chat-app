export const sender = (parent, args, ctx, info) => {
  return ctx.userLoader.load(parent.sender.toString());
};
