import { withFilter, AuthenticationError } from 'apollo-server-express';

import { pubsub } from '#graphql/pubsub';
import { CHAT, NOT_AUTHORIZED } from '#config/constants';

export const chat = {
  subscribe: withFilter(
    (root, args, ctx) => {
      if (!ctx?.userId) throw new AuthenticationError(NOT_AUTHORIZED);

      return pubsub.asyncIterator([CHAT]);
    },
    async (payload, variables, ctx) => {
      // Only send to participants
      return payload.chat.data.participants.includes(ctx?.userId);
    }
  ),
};
