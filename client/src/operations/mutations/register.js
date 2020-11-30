import { gql, useMutation } from '@apollo/client';
import { ME } from '../queries/me';

export const REGISTER = gql`
  mutation register($registerInput: UserRegisterInput!) {
    register(input: $registerInput) {
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
    data: { me: data?.register },
  });
};

export const useRegister = () => {
  const [mutate, { data, error, loading }] = useMutation(REGISTER, {
    update,
  });

  return { mutate, data, error, loading };
};
