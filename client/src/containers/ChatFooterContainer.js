import { createRef, useCallback, useState } from 'react';
import { useReactiveVar } from '@apollo/client';

import { StyledChat } from '../styles/StyledChat';
import { ChatFooter } from '../components/ChatFooter';

import { useAddMessage } from '../operations/mutations/addMessage';
import { activeChat } from '../cache';

const inputRef = createRef();

export const ChatFooterContainer = () => {
  const { mutate, loading } = useAddMessage();

  const chatId = useReactiveVar(activeChat);
  const [text, setText] = useState('');

  const handleAddMessage = useCallback(async () => {
    // Don't submit empty text
    if (text === '') return;

    try {
      await mutate({ variables: { messageInput: { chatId, text } } });
      setText('');
      inputRef.current?.focus();
    } catch (error) {
      console.log(error);
    }
  }, [mutate, chatId, text]);

  const handleSetText = (e) => setText(e.target.value);
  const handleEnter = (e) => e.key === 'Enter' && handleAddMessage();

  return (
    <StyledChat.Footer>
      <ChatFooter
        handleAddMessage={handleAddMessage}
        isSubmitting={loading}
        text={text}
        handleSetText={handleSetText}
        handleEnter={handleEnter}
        inputRef={inputRef}
      />
    </StyledChat.Footer>
  );
};
