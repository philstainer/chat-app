import PropTypes from 'prop-types';
import { ArrowLeft } from 'react-feather';

import { $App } from '../styles/$App';

export const ChatHeader = ({ closeChat }) => {
  return (
    <$App.Header>
      <ArrowLeft size={18} onClick={closeChat} data-testid="goBack" />
    </$App.Header>
  );
};

ChatHeader.propTypes = {
  closeChat: PropTypes.func.isRequired,
};
