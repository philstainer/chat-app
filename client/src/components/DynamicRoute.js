import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import { MotionRoute } from './MotionRoute';
import { MotionRedirect } from './MotionRedirect';

import { accessToken } from '../cache';

export const DynamicRoute = ({
  component,
  authenticated,
  guest,
  location,
  ...props
}) => {
  const rAccessToken = useReactiveVar(accessToken);

  if (authenticated && !rAccessToken)
    return (
      <MotionRedirect to={{ pathname: '/login', state: { from: location } }} />
    );

  if (guest && rAccessToken)
    return <MotionRedirect to={{ pathname: '/', state: { from: location } }} />;

  return <MotionRoute component={component} {...props} />;
};

DynamicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  authenticated: PropTypes.bool,
  guest: PropTypes.bool,
  location: PropTypes.shape({}),
};
