import { ApolloServer, PubSub, mergeSchemas } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

import { accessEnv } from '../utils/accessEnv';

import { schemas } from './schemas';
import { resolvers } from './resolvers';
import { context } from './context';

const isProduction = accessEnv('NODE_ENV') === 'production';

export const pubsub = new PubSub();

const schema = mergeSchemas({
  schemas,
  resolvers,
});

export const apolloServer = new ApolloServer({
  schema,
  context,
  plugins: [...(!isProduction && [ApolloServerPluginInlineTrace()])],
});
