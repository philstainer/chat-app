import { chats } from '#graphql/chat/resolvers/chats';
import { createChat } from '#graphql/chat/resolvers/createChat';
import { chat } from '#graphql/chat/resolvers/chat';
import { participants } from '#graphql/chat/resolvers/participants';
import { lastMessage } from '#graphql/chat/resolvers/lastMessage';

export const chatResolver = {
  Query: {
    chats,
  },
  Mutation: {
    createChat,
  },
  Subscription: {
    chat,
  },

  Chat: {
    participants,
    lastMessage,
  },
};
