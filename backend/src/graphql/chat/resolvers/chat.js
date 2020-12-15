import { withFilter } from 'apollo-server-express';

import { pubsub } from '#graphql/pubsub';
import { CHAT } from '#config/constants';

export const chat = {
  subscribe: withFilter(
    () => pubsub.asyncIterator([CHAT]),
    async (payload, variables, ctx) => {
      if (!ctx?.userId) return false;

      // Only send to participants
      return payload.chatCreated.participants.includes(ctx?.userId);
    }
  ),
};
