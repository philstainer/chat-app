import { Chat } from './chat.modal';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';

export const chatResolver = {
  Query: {
    chats: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      // Should generate selectedFields via info
      const selected = selectedFields(info);

      // Should get all chats for user
      const foundChats = await Chat.find({
        participants: { $in: [ctx?.req?.userId] },
      })
        .select(selected)
        .lean();

      // Should return all found chats
      return foundChats;
    },
  },
};
