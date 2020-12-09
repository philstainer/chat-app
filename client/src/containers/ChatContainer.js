import { createRef, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';

import { Messages } from '../components/Messages';

import { activeChat } from '../cache';
import { useMe } from '../operations/queries/me';
import { useMessages } from '../operations/queries/messages';
import {
  MESSAGE_ADDED,
  messageUpdateQuery,
} from '../operations/subscriptions/messageAdded';

export const ChatContainer = () => {
  const messagesEndRef = createRef();
  const rActiveChat = useReactiveVar(activeChat);

  const { data: meData, loading: loadingMe, error: meError } = useMe();
  const {
    data: messagesData,
    loading: loadingMessages,
    error: messagesError,
    subscribeToMore,
  } = useMessages({
    variables: { messagesInput: { chatId: rActiveChat?._id } },
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
    <Messages
      messages={messagesData.messages}
      me={meData.me}
      messagesEndRef={messagesEndRef}
    />
  );
};
