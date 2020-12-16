import { withFilter, AuthenticationError } from 'apollo-server-express';

import { pubsub } from '#graphql/pubsub';
import { MESSAGE, NOT_AUTHORIZED } from '#config/constants';

export const message = {
  subscribe: withFilter(
    (root, args, ctx) => {
      if (!ctx?.userId) throw new AuthenticationError(NOT_AUTHORIZED);

      return pubsub.asyncIterator([MESSAGE]);
    },
    (payload, variables, ctx) => {
      return payload.chat.participants
        .map(participant => participant.toString())
        .includes(ctx.userId);
    }
  ),
};
