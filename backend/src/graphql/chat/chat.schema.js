import { gql } from 'apollo-server-express';

export const chatSchema = gql`
  extend type Query {
    chats: [Chat!]! @isAuthenticated
  }

  extend type Mutation {
    createChat(input: CreateChatInput!): Chat! @isAuthenticated
  }

  extend type Subscription {
    chatCreated: Chat!
  }

  type Chat {
    _id: ID!
    participants: [User!]!
    lastMessage: Message
  }

  input CreateChatInput {
    participants: [ID!]!
  }
`;
