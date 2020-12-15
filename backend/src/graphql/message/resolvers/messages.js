import { AuthenticationError } from 'apollo-server-express';

import { Message } from '#graphql/message/message.model';
import { Chat } from '#graphql/chat/chat.model';
import { selectedFields } from '#utils/selectedFields';
import { PERMISSIONS_ERROR } from '#config/constants';

export const messages = async (parent, args, ctx, info) => {
  // Should be a participant in chat
  const foundChat = await Chat.findOne({
    _id: args?.input?.chatId,
    participants: { $in: [ctx?.userId] },
  })
    .select('_id')
    .lean();

  if (!foundChat) throw new AuthenticationError(PERMISSIONS_ERROR);

  // Should generate selectedFields via info
  const selected = selectedFields(info);

  // Should get all messages for chat
  const foundMessages = await Message.find({
    chatId: args?.input?.chatId,
  })
    .select(selected)
    .sort({ createdAt: 'desc' })
    .limit(args?.input?.limit ?? 20)
    .skip(args?.input?.skip ?? 0)
    .lean();

  return foundMessages.reverse();
};
