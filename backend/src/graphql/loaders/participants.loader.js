import DataLoader from 'dataloader';
import { User } from '../user/user.modal';

export const participantsLoader = new DataLoader(async (participants) => {
  // Flatten arrays
  const flattenArray = participants.flat().map((item) => item.toString());

  // Get only uniques
  const uniqueArray = [...new Set(flattenArray)];

  // Find users and push to map
  const foundUsers = await User.find({ _id: { $in: uniqueArray } }).lean();
  const foundUserMap = new Map(
    foundUsers.map((user) => [user._id.toString(), user])
  );

  // Loop over original array and populate users
  const foundParticipants = participants.map((item) =>
    item.map((participant) => foundUserMap.get(participant.toString()))
  );

  return foundParticipants;
});
