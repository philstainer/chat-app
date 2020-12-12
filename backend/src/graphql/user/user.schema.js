import { gql } from 'apollo-server-express';

export const userSchema = gql`
  type Query {
    me: User
    refreshTokens: TokenResult!
  }

  type Mutation {
    register(input: UserRegisterInput!): TokenResult!
    login(input: UserLoginInput!): TokenResult!
    logout: Boolean
    confirmAccount(input: ConfirmAccountInput!): Boolean
    resetPasswordRequest(input: ResetPasswordRequestInput!): Boolean
    resetPassword(input: ResetPasswordInput): TokenResult!
  }

  type Subscription {
    _empty: String
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
  union TokenResult = Token | SystemError

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
