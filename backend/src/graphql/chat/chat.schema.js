import { gql } from 'apollo-server-express';

export const chatSchema = gql`
  type Query {
    chats: [Chat!]!
  }

  type Mutation {
    createChat(input: CreateChatInput!): Chat!
  }

  type Subscription {
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
