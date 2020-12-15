import { useReactiveVar } from '@apollo/client';

import { ChatHeader } from '../components/ChatHeader';
import { activeChat } from '../cache';

export const ChatHeaderContainer = () => {
  const rActiveChat = useReactiveVar(activeChat);

  const handleCloseChat = () => activeChat(null);

  return (
    <ChatHeader
      participants={rActiveChat.participants}
      closeChat={handleCloseChat}
    />
  );
};
