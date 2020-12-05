import { UserInputError } from 'apollo-server-express';
import { Chat } from '../graphql/chat/chat.modal';
import { GENERAL_ERROR } from './constants';

export const isParticipant = async (chatId, userId) => {
  const foundChat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  })
    .select('_id')
    .lean();

  if (!foundChat) throw new UserInputError(GENERAL_ERROR);

  return !!foundChat;
};
