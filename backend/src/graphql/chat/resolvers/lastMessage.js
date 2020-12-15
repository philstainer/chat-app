export const lastMessage = (parent, args, ctx, info) => {
  if (!parent?.lastMessage) return null;

  return ctx.messageLoader.load(parent.lastMessage);
};
