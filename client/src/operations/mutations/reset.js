import { gql, useMutation } from '@apollo/client';
import { ME } from '../queries/me';

export const RESET = gql`
  mutation reset($resetPasswordInput: ResetPasswordInput) {
    resetPassword(input: $resetPasswordInput) {
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
    data: { me: data?.reset },
  });
};

export const useReset = () => {
  const [mutate, { data, error, loading }] = useMutation(RESET, {
    update,
  });

  return { mutate, data, error, loading };
};
