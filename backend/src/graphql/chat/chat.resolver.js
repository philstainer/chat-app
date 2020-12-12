import { UserInputError, withFilter } from 'apollo-server-express';

import { pubsub } from '../pubsub';
import { Chat } from './chat.model';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import {
  INVALID_PARTICIPANTS_ERROR,
  CHAT_CREATED,
} from '../../config/constants';

export const chatResolver = {
  Query: {
    chats: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      // Should generate selectedFields via info
      const selected = selectedFields(info);

      // Should get all chats for user
      const foundChats = await Chat.find({
        participants: { $in: [ctx?.userId] },
      })
        .select(selected)
        .sort({ updatedAt: 'desc' })
        .lean();

      // Should return all found chats
      return foundChats;
    },
  },
  Mutation: {
    createChat: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      // Filter out logged in user id
      const participants = args?.input?.participants.filter(
        item => item !== ctx?.userId
      );

      // Don't create empty chat
      if (participants.length === 0)
        throw new UserInputError(INVALID_PARTICIPANTS_ERROR);

      // Should create chat with participants
      const createdChat = await Chat.create({
        participants: [ctx?.userId, ...participants],
      });

      // Publish chat to subscriptions
      pubsub.publish(CHAT_CREATED, { chatCreated: createdChat });

      return createdChat;
    },
  },
  Subscription: {
    chatCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHAT_CREATED]),
        async (payload, variables, ctx) => {
          if (!ctx?.userId) return false;

          // Only send to participants
          return payload.chatCreated.participants.includes(ctx?.userId);
        }
      ),
    },
  },

  Chat: {
    participants: async (parent, args, ctx, info) => {
      return ctx.userLoader.loadMany(
        parent.participants.map(id => id.toString())
      );
    },
    lastMessage: (parent, args, ctx, info) => {
      if (!parent?.lastMessage) return null;

      return ctx.messageLoader.load(parent.lastMessage);
    },
  },
};
