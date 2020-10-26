import { gql } from 'apollo-server-express';

import userSchema from './user/user.schema.graphql';
import chatSchema from './chat/chat.schema.graphql';
import messageSchema from './message/message.schema.graphql';

const root = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

const schemas = [root, userSchema, chatSchema, messageSchema];

export { schemas };
