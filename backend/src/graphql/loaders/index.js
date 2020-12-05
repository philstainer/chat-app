import { userLoader } from './user.loader';
import { messageLoader } from './message.loader';

export const loaders = () => ({
  userLoader: userLoader(),
  messageLoader: messageLoader(),
});
