import PropTypes from 'prop-types';
import { createRef, useEffect } from 'react';

import { Messages } from '../components/Messages';
import { StyledChat } from '../styles/StyledChat';

import { useMe } from '../operations/queries/me';
import { useMessages } from '../operations/queries/messages';
import {
  MESSAGE_ADDED,
  messageUpdateQuery,
} from '../operations/subscriptions/messageAdded';

export const ChatContainer = ({ chatId }) => {
  const messagesEndRef = createRef();

  const { data: meData, loading: loadingMe, error: meError } = useMe();
  const {
    data: messagesData,
    loading: loadingMessages,
    error: messagesError,
    subscribeToMore,
  } = useMessages({
    variables: { messagesInput: { chatId } },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_ADDED,
      updateQuery: messageUpdateQuery,
    });

    return () => unsubscribe();
  }, [messagesData, subscribeToMore]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEndRef, messagesData]);

  if (loadingMe || loadingMessages) return <div>Loading...</div>;
  if (meError || messagesError) return <div>An error occurred</div>;

  return (
    <StyledChat.Body>
      <Messages
        messages={messagesData.messages}
        me={meData.me}
        messagesEndRef={messagesEndRef}
      />
    </StyledChat.Body>
  );
};

ChatContainer.propTypes = {
  chatId: PropTypes.string.isRequired,
};
