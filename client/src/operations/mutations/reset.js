import { gql, useMutation } from '@apollo/client';

import { accessToken } from '../../cache';
import { ACCESS_TOKEN } from '../../utils/constants';

export const RESET = gql`
  mutation reset($resetPasswordInput: ResetPasswordInput) {
    resetPassword(input: $resetPasswordInput) {
      token
    }
  }
`;

const update = (cache, { data }) => {
  const { token } = data.resetPassword;

  localStorage.setItem(ACCESS_TOKEN, token);
  accessToken(token);
};

export const useReset = () => {
  const [mutate, { data, error, loading }] = useMutation(RESET, {
    update,
  });

  return { mutate, data, error, loading };
};
