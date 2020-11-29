import PropTypes from 'prop-types';

import { StyledButton } from '../styles/StyledButton';

export const Button = ({ children, loading, onClick, ...props }) => (
  <StyledButton
    data-testid="StyledButton"
    isLoading={loading}
    onClick={onClick}
    disabled={loading}
    {...props}
  >
    {loading ? (
      <StyledButton.Loader
        data-testid="StyledButton.Loader"
        size={18}
        strokeWidth={3}
      />
    ) : (
      children
    )}
  </StyledButton>
);

Button.defaultProps = {
  loading: false,
};

Button.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};
