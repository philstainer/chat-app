import { gql } from 'apollo-server-express';

import { userSchema } from './user/user.schema';
import { chatSchema } from './chat/chat.schema';
import { messageSchema } from './message/message.schema.js';

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
