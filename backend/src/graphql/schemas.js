import { gql } from 'apollo-server-express';

import { userSchema } from '#graphql/user/user.schema';
import { chatSchema } from '#graphql/chat/chat.schema';
import { messageSchema } from '#graphql/message/message.schema';

const root = gql`
  scalar DateTime

  directive @isAuthenticated on FIELD_DEFINITION
  directive @isGuest on FIELD_DEFINITION

  enum MutationType {
    CREATE
    UPDATE
    DELETE
  }

  type Query {
    root: String
  }

  type Mutation {
    root: String
  }

  type Subscription {
    root: String
  }
`;

export const schemas = [root, userSchema, chatSchema, messageSchema];
