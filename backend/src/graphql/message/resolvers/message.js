import { withFilter } from 'apollo-server-express';

import { pubsub } from '#graphql/pubsub';
import { MESSAGE } from '#config/constants';

export const message = {
  subscribe: withFilter(
    () => pubsub.asyncIterator([MESSAGE]),
    (payload, variables, ctx) => {
      return payload.chat.participants.includes(ctx.userId);
    }
  ),
};
