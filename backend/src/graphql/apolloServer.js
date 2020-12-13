import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

import { accessEnv } from '#utils/accessEnv';

import { schemas } from '#graphql/schemas';
import { resolvers } from '#graphql/resolvers';
import { schemaDirectives } from '#graphql/schemaDirectives';
import { context } from '#graphql/context';

const isProduction = accessEnv('NODE_ENV') === 'production';

const schema = makeExecutableSchema({
  typeDefs: schemas,
  resolvers,
  schemaDirectives,
});

export const apolloServer = new ApolloServer({
  schema,
  context,
  plugins: [...(!isProduction && [ApolloServerPluginInlineTrace()])],
});
