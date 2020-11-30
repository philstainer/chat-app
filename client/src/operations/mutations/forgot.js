import { gql, useMutation } from '@apollo/client';

export const FORGOT = gql`
  mutation forgot($resetPasswordRequestInput: ResetPasswordRequestInput!) {
    resetPasswordRequest(input: $resetPasswordRequestInput)
  }
`;

export const useForgot = () => {
  const [mutate, { data, error, loading }] = useMutation(FORGOT);

  return { mutate, data, error, loading };
};
