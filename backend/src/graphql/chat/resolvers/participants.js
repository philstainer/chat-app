export const participants = async (parent, args, ctx, info) => {
  return ctx.userLoader.loadMany(parent.participants.map(id => id.toString()));
};
