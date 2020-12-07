import { gql } from '@apollo/client';

export const MESSAGE_ADDED = gql`
  subscription messageAdded {
    messageAdded {
      _id
      text
      sender {
        _id
      }
      createdAt
    }
  }
`;

export const messageUpdateQuery = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) return prev;

  const newMessage = subscriptionData.data.messageAdded;

  return { ...prev, messages: [...prev?.messages, newMessage] };
};
