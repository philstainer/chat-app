import PropTypes from 'prop-types';
import { Send } from 'react-feather';

import {
  StyledInput,
  StyledPaperclip,
  StyledSend,
} from '../styles/StyledChatFooter';

export const ChatFooter = ({
  text,
  isSubmitting,
  handleAddMessage,
  handleSetText,
  handleEnter,
  inputRef,
}) => {
  return (
    <>
      <StyledPaperclip size={24} />
      <StyledInput
        type="text"
        value={text}
        onChange={handleSetText}
        onKeyPress={handleEnter}
        disabled={isSubmitting}
        ref={inputRef}
        autoFocus
      />
      <StyledSend onClick={handleAddMessage} disabled={isSubmitting}>
        <Send size={18} />
      </StyledSend>
    </>
  );
};

ChatFooter.propTypes = {
  text: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleAddMessage: PropTypes.func.isRequired,
  handleSetText: PropTypes.func.isRequired,
  handleEnter: PropTypes.func.isRequired,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};
