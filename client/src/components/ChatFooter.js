import PropTypes from 'prop-types';
import { Send } from 'react-feather';

import { $App } from '../styles/$App';
import { $Input, $Paperclip, $Send } from '../styles/$ChatFooter';

export const ChatFooter = ({
  text,
  isSubmitting,
  handleAddMessage,
  handleSetText,
  handleEnter,
  inputRef,
}) => {
  return (
    <$App.Footer>
      <$Paperclip size={24} />
      <$Input
        type="text"
        value={text}
        onChange={handleSetText}
        onKeyPress={handleEnter}
        disabled={isSubmitting}
        ref={inputRef}
        autoFocus
      />
      <$Send onClick={handleAddMessage} disabled={isSubmitting}>
        <Send size={18} />
      </$Send>
    </$App.Footer>
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
