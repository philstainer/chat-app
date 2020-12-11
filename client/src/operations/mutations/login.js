import { gql, useMutation } from '@apollo/client';

import { accessToken } from '../../cache';
import { ACCESS_TOKEN } from '../../utils/constants';

export const LOGIN = gql`
  mutation login($loginInput: UserRegisterInput!) {
    login(input: $loginInput) {
      token
    }
  }
`;

const update = (cache, { data }) => {
  const { token } = data.login;

  localStorage.setItem(ACCESS_TOKEN, token);
  accessToken(token);
};

export const useLogin = () => {
  const [mutate, { data, error, loading }] = useMutation(LOGIN, {
    update,
  });

  return { mutate, data, error, loading };
};
