import { useQuery } from '@apollo/client';

import { MotionRoute } from '../components/MotionRoute';
import { MotionRedirect } from '../components/MotionRedirect';
import { ME } from '../operations/queries/me';

export const PublicRoute = ({ component, ...rest }) => {
  const { data, loading, error } = useQuery(ME);

  if (loading) return null;
  if (error) return <div>Error: {error?.message}</div>;
  if (data?.me !== null)
    return (
      <MotionRedirect to={{ pathname: '/', state: { from: rest.location } }} />
    );

  return <MotionRoute {...rest} component={component} />;
};
