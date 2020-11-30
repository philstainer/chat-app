import { useEffect } from 'react';
import PropTypes from 'prop-types';

export const Verify = ({ handleVerify }) => {
  useEffect(handleVerify, [handleVerify]);

  return null;
};

Verify.propTypes = {
  handleVerify: PropTypes.func.isRequired,
};
