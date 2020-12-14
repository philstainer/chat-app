import { gql, useQuery } from '@apollo/client';

export const ME = gql`
  query me {
    me {
      _id
      username
      image
      verified
    }
  }
`;

export const useMe = () => {
  const query = useQuery(ME);

  return query;
};
