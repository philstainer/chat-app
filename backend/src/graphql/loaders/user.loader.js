import DataLoader from 'dataloader';
import { User } from '#graphql/user/user.model';

export const userLoader = () => {
  const loader = new DataLoader(async ids => {
    loader.clearAll(); // Fix for subscriptions

    const uniqueArray = [...new Set(ids)];

    // Find data and push to map
    const data = await User.find({
      _id: { $in: uniqueArray },
    }).lean();

    const dataMap = new Map(data.map(item => [item._id.toString(), item]));

    // Loop over original array and populate users
    const result = ids.map(id => dataMap.get(id.toString()));

    return result;
  });

  return loader;
};
