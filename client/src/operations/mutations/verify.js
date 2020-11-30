import { gql, useMutation } from '@apollo/client';

export const VERIFY = gql`
  mutation verify($confirmAccountInput: ConfirmAccountInput!) {
    confirmAccount(input: $confirmAccountInput)
  }
`;

export const useVerify = () => {
  const [mutate, { data, error, loading }] = useMutation(VERIFY);

  return { mutate, data, error, loading };
};
