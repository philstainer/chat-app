import { ApolloServer, mergeSchemas } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

import { accessEnv } from '../utils/accessEnv';

import { schemas } from './schemas';
import { resolvers } from './resolvers';
import { context } from './context';
import { subscriptions } from './subscriptions';

const isProduction = accessEnv('NODE_ENV') === 'production';

const schema = mergeSchemas({
  schemas,
  resolvers,
});

export const apolloServer = new ApolloServer({
  schema,
  context,
  plugins: [...(!isProduction && [ApolloServerPluginInlineTrace()])],
  subscriptions,
});
