import PropTypes from 'prop-types';

import { $Button } from '../styles/$Button';

export const Button = ({ children, loading, onClick, ...props }) => (
  <$Button isLoading={loading} onClick={onClick} disabled={loading} {...props}>
    {loading ? (
      <$Button.Loader data-testid="$Button.Loader" size={18} strokeWidth={3} />
    ) : (
      children
    )}
  </$Button>
);

Button.defaultProps = {
  loading: false,
};

Button.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};
