import { Message } from './message.modal';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';

const messageResolver = {
  Query: {
    messages: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      // Should generate selectedFields via info
      const selected = selectedFields(info);

      // Should get all messages for chat
      const foundMessages = await Message.find({
        chatId: args?.input?.chatId,
      })
        .select(selected)
        .sort({ createdAt: 'desc' })
        .limit(args?.input?.limit || 20)
        .skip(args?.input?.skip || 0)
        .lean();

      return foundMessages;
    },
  },
};

export { messageResolver };
