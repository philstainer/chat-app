import PropTypes from 'prop-types';
import moment from 'moment';

import { StyledMessages } from '../styles/StyledMessages';

export const Messages = ({ messages, me, messagesEndRef }) => {
  return (
    <StyledMessages>
      {messages.map((message, index) => {
        const isMe = message.sender._id === me._id;
        const isSmallMargin =
          messages[index + 1]?.sender._id === message.sender._id;

        const messageDate = moment(new Date(message.createdAt)).format(
          'hh:mm a'
        );

        return (
          <StyledMessages.Message
            key={message._id}
            isMe={isMe}
            isSmallMargin={isSmallMargin}
          >
            <StyledMessages.Text>{message.text}</StyledMessages.Text>
            <StyledMessages.Date>{messageDate}</StyledMessages.Date>
          </StyledMessages.Message>
        );
      })}
      <div ref={messagesEndRef}></div>
    </StyledMessages>
  );
};

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
  me: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
