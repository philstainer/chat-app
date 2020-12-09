import { createRef, useCallback, useState } from 'react';
import { useReactiveVar } from '@apollo/client';

import { ChatFooter } from '../components/ChatFooter';

import { useAddMessage } from '../operations/mutations/addMessage';
import { activeChat } from '../cache';

const inputRef = createRef();

export const ChatFooterContainer = () => {
  const { mutate, loading } = useAddMessage();

  const rActiveChat = useReactiveVar(activeChat);
  const [text, setText] = useState('');

  const handleAddMessage = useCallback(async () => {
    // Don't submit empty text
    if (text === '') return;

    try {
      await mutate({
        variables: { messageInput: { chatId: rActiveChat?._id, text } },
      });
      setText('');
      inputRef.current?.focus();
    } catch (error) {}
  }, [mutate, rActiveChat, text]);

  const handleSetText = e => setText(e.target.value);
  const handleEnter = e => e.key === 'Enter' && handleAddMessage();

  return (
    <ChatFooter
      handleAddMessage={handleAddMessage}
      isSubmitting={loading}
      text={text}
      handleSetText={handleSetText}
      handleEnter={handleEnter}
      inputRef={inputRef}
    />
  );
};
