import { userLoader } from '#graphql/loaders/user.loader';
import { messageLoader } from '#graphql/loaders/message.loader';

export const loaders = () => ({
  userLoader: userLoader(),
  messageLoader: messageLoader(),
});
