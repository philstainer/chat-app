import { UserInputError } from 'apollo-server-express';

import { Chat } from './chat.modal';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { selectedFields } from '../../utils/selectedFields';
import { INVALID_PARTICIPANTS_ERROR } from '../../utils/constants';

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
  Mutation: {
    createChat: async (parent, args, ctx, info) => {
      // Should be logged in
      isAuthenticated(ctx);

      const participants = args?.input?.participants.filter(
        (item) => item !== ctx?.req?.userId
      );

      if (participants.length === 0)
        throw new UserInputError(INVALID_PARTICIPANTS_ERROR);

      // Should create chat with participants
      const createdChat = await Chat.create({
        participants: [ctx?.req?.userId, ...participants],
      });

      return createdChat;
    },
  },
};
