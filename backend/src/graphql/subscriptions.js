import { wsAuthentication } from '../utils/wsAuthentication';

export const subscriptions = {
  onConnect: async (connectionParams, webSocket, context) => {
    const userId = await wsAuthentication(webSocket);

    return { userId };
  },
};
