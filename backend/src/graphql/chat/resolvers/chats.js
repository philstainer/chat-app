import { selectedFields } from '#utils/selectedFields';
import { Chat } from '#graphql/chat/chat.model';

export const chats = async (parent, args, ctx, info) => {
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
};
