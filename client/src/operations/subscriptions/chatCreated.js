import { gql } from '@apollo/client';

export const CHAT_CREATED = gql`
  subscription chatCreated {
    chatCreated {
      _id
      participants {
        _id
        image
        email
      }
      lastMessage {
        _id
        text
      }
    }
  }
`;

export const chatUpdateQuery = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) return prev;

  const newChat = subscriptionData.data.chatCreated;

  return { ...prev, chats: [newChat, ...prev?.chats] };
};
