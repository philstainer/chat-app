import { gql } from 'apollo-server-express';

export const userSchema = gql`
  extend type Query {
    me: User @isAuthenticated
    refreshTokens: Token!
  }

  extend type Mutation {
    register(input: UserRegisterInput!): Token! @isGuest
    login(input: UserLoginInput!): Token! @isGuest
    logout: Boolean @isAuthenticated
    confirmAccount(input: ConfirmAccountInput!): Boolean
    resetPasswordRequest(input: ResetPasswordRequestInput!): Boolean @isGuest
    resetPassword(input: ResetPasswordInput): Token! @isGuest
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    image: String
    verified: Boolean
    blocked: Boolean
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Token {
    token: String!
  }

  input UserRegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input UserLoginInput {
    emailOrUsername: String!
    password: String!
  }

  input ConfirmAccountInput {
    token: String!
  }

  input ResetPasswordRequestInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }
`;
