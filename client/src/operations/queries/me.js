import { gql, useQuery } from '@apollo/client';

export const ME = gql`
  query me {
    me {
      _id
      email
      image
      verified
    }
  }
`;

export const useMe = () => {
  const query = useQuery(ME);

  return query;
};
