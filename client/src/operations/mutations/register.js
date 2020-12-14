import { gql, useMutation } from '@apollo/client';

import { accessToken } from '../../cache';
import { ACCESS_TOKEN } from '../../utils/constants';

export const REGISTER = gql`
  mutation register($registerInput: UserRegisterInput!) {
    register(input: $registerInput) {
      token
    }
  }
`;

const update = (cache, { data }) => {
  const { token } = data.register;

  localStorage.setItem(ACCESS_TOKEN, token);

  accessToken(token);
};

export const useRegister = () => {
  const [mutate, { data, error, loading }] = useMutation(REGISTER, {
    update,
  });

  return { mutate, data, error, loading };
};
