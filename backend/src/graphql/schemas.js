import { gql } from 'apollo-server-express';

import { userSchema } from '#graphql/user/user.schema';
import { chatSchema } from '#graphql/chat/chat.schema';
import { messageSchema } from '#graphql/message/message.schema';

const root = gql`
  scalar DateTime

  interface Error {
    message: String!
  }

  type SystemError implements Error {
    message: String!
  }
`;

export const schemas = [root, userSchema, chatSchema, messageSchema];
