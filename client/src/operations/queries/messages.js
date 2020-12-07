import { gql, useQuery } from '@apollo/client';

export const MESSAGES = gql`
  query messages($messagesInput: MessagesInput!) {
    messages(input: $messagesInput) {
      _id
      text
      sender {
        _id
      }
      createdAt
    }
  }
`;

export const useMessages = (options = {}) => {
  const query = useQuery(MESSAGES, options);

  return query;
};
