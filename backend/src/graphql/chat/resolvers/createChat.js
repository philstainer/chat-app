import { UserInputError } from 'apollo-server-express';

import { pubsub } from '#graphql/pubsub';
import { Chat } from '#graphql/chat/chat.model';
import { INVALID_PARTICIPANTS_ERROR, CHAT, MUTATION } from '#config/constants';

export const createChat = async (parent, args, ctx, info) => {
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
  pubsub.publish(CHAT, {
    chat: {
      mutation: MUTATION.CREATE,
      data: createdChat,
    },
  });

  return createdChat;
};
