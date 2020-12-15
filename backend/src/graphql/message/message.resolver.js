import { messages } from '#graphql/message/resolvers/messages';
import { addMessage } from '#graphql/message/resolvers/addMessage';
import { message } from '#graphql/message/resolvers/message';
import { sender } from '#graphql/message/resolvers/sender';

const messageResolver = {
  Query: {
    messages,
  },
  Mutation: {
    addMessage,
  },
  Subscription: {
    message,
  },
  Message: {
    sender,
  },
};

export { messageResolver };
