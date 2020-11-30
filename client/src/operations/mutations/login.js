import { gql, useMutation } from '@apollo/client';
import { ME } from '../queries/me';

export const LOGIN = gql`
  mutation login($loginInput: UserRegisterInput!) {
    login(input: $loginInput) {
      _id
      email
      image
      confirmed
    }
  }
`;

const update = (cache, { data }) => {
  cache.writeQuery({
    query: ME,
    data: { me: data?.login },
  });
};

export const useLogin = () => {
  const [mutate, { data, error, loading }] = useMutation(LOGIN, {
    update,
  });

  return { mutate, data, error, loading };
};
