import { Message } from './message.modal';
import { Chat } from '../chat/chat.modal';
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
  Mutation: {
    addMessage: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      // Should create new message
      const createdMessage = await Message.create({
        chatId: args?.input?.chatId,
        text: args?.input?.text,
        sender: ctx?.req?.userId,
      });

      // Update chat with last message id
      await Chat.findByIdAndUpdate(args?.input?.chatId, {
        $set: { lastMessage: createdMessage?._id },
      });

      // Should return message
      return createdMessage;
    },
  },
};

export { messageResolver };
