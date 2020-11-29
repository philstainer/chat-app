import { PubSub } from 'apollo-server-express';

const pubsub = new PubSub();

const context = (ctx) => ({ ...ctx, pubsub });

export { context };
