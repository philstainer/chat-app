import { gql } from 'apollo-server-express';

export const messageSchema = gql`
  type Query {
    messages(input: MessagesInput!): [Message!]!
  }

  type Mutation {
    addMessage(input: MessageInput!): Message!
  }

  type Subscription {
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
