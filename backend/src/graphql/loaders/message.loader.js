import DataLoader from 'dataloader';
import { Message } from '../message/message.modal';

export const messageLoader = new DataLoader(async (ids) => {
  // Find users and push to map
  const foundMessages = await Message.find({
    _id: { $in: ids },
  }).lean();

  const foundMessagesMap = new Map(
    foundMessages.map((message) => [message._id.toString(), message])
  );

  // Loop over original array and populate users
  const result = ids.map((id) => foundMessagesMap.get(id.toString()));

  return result;
});
