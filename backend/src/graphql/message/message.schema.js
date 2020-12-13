import { gql } from 'apollo-server-express';

export const messageSchema = gql`
  extend type Query {
    messages(input: MessagesInput!): [Message!]! @isAuthenticated
  }

  extend type Mutation {
    addMessage(input: MessageInput!): Message! @isAuthenticated
  }

  extend type Subscription {
    messageAdded: Message!
  }

  type Message {
    _id: ID!
    text: String
    sender: User!
    createdAt: DateTime!
  }

  input MessagesInput {
    chatId: ID!
    skip: Int
    limit: Int
  }

  input MessageInput {
    chatId: ID!
    text: String!
  }
`;
