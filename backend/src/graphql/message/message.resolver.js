import { withFilter } from 'apollo-server-express';

import { pubsub } from '../pubsub';
import { Message } from './message.model';
import { Chat } from '../chat/chat.model';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import { MESSAGE_ADDED } from '../../utils/constants';
import { isParticipant } from '../../utils/isParticipant';

const messageResolver = {
  Query: {
    messages: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      // Should be a participant in chat
      await isParticipant(args?.input?.chatId, ctx?.req?.userId);

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

      return foundMessages.reverse();
    },
  },
  Mutation: {
    addMessage: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      // Should be a participant in chat
      await isParticipant(args?.input?.chatId, ctx?.req?.userId);

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

      // Publish chat to subscriptions
      pubsub.publish(MESSAGE_ADDED, { messageAdded: createdMessage });

      // Should return message
      return createdMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_ADDED]),
        (payload, variables, ctx) => {
          return isParticipant(payload.messageAdded.chatId, ctx.userId);
        }
      ),
    },
  },
  Message: {
    sender: (parent, args, ctx, info) => {
      return ctx.userLoader.load(parent.sender.toString());
    },
  },
};

export { messageResolver };
