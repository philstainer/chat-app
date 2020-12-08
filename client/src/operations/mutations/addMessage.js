import { gql, useMutation } from '@apollo/client';

export const ADD_MESSAGE = gql`
  mutation addMessage($messageInput: MessageInput!) {
    addMessage(input: $messageInput) {
      _id
    }
  }
`;

export const useAddMessage = () => {
  const [mutate, other] = useMutation(ADD_MESSAGE);

  return { mutate, ...other };
};
