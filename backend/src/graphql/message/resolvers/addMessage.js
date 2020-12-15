import { AuthenticationError } from 'apollo-server-express';

import { pubsub } from '#graphql/pubsub';
import { Message } from '#graphql/message/message.model';
import { Chat } from '#graphql/chat/chat.model';

import { MESSAGE, MUTATION, PERMISSIONS_ERROR } from '#config/constants';

export const addMessage = async (parent, args, ctx, info) => {
  // Should be a participant in chat
  const foundChat = await Chat.findOne({
    _id: args?.input?.chatId,
    participants: { $in: [ctx?.userId] },
  })
    .select('_id participants')
    .lean();
  if (!foundChat) throw new AuthenticationError(PERMISSIONS_ERROR);

  // Should create new message
  const createdMessage = await Message.create({
    chatId: args?.input?.chatId,
    text: args?.input?.text,
    sender: ctx?.userId,
  });

  // Update chat with last message id
  const chat = await Chat.findByIdAndUpdate(args?.input?.chatId, {
    $set: { lastMessage: createdMessage?._id },
  }).lean();

  // Publish chat to subscriptions
  pubsub.publish(MESSAGE, {
    chat,
    message: {
      mutation: MUTATION.CREATE,
      data: createdMessage,
    },
  });

  // Should return message
  return createdMessage;
};
