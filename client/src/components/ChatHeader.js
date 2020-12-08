import PropTypes from 'prop-types';
import { ArrowLeft } from 'react-feather';

import { StyledChat } from '../styles/StyledChat';

export const ChatHeader = ({ closeChat }) => {
  return (
    <StyledChat.Header>
      <ArrowLeft size={18} onClick={closeChat} data-testid="goBack" />
    </StyledChat.Header>
  );
};

ChatHeader.propTypes = {
  closeChat: PropTypes.func.isRequired,
};
