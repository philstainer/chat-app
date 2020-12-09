import PropTypes from 'prop-types';
import moment from 'moment';

import { $App } from '../styles/$App';
import { $Messages } from '../styles/$Messages';

export const Messages = ({ messages, me, messagesEndRef }) => {
  return (
    <$App.Content>
      <$Messages>
        {messages.map((message, index) => {
          const isMe = message.sender._id === me._id;
          const isSmallMargin =
            messages[index + 1]?.sender._id === message.sender._id;

          const messageDate = moment(new Date(message.createdAt)).format(
            'hh:mm a'
          );

          return (
            <$Messages.Message
              key={message._id}
              isMe={isMe}
              isSmallMargin={isSmallMargin}
            >
              <$Messages.Text>{message.text}</$Messages.Text>
              <$Messages.Date>{messageDate}</$Messages.Date>
            </$Messages.Message>
          );
        })}
        <div ref={messagesEndRef}></div>
      </$Messages>
    </$App.Content>
  );
};

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
  me: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
