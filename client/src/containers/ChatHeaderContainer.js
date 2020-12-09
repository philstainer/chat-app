import { useReactiveVar } from '@apollo/client';

import { ChatHeader } from '../components/ChatHeader';
import { activeChat } from '../cache';

export const ChatHeaderContainer = () => {
  const rActiveChat = useReactiveVar(activeChat);

  const handleCloseChat = () => activeChat(null);

  const { image, email } = rActiveChat?.participants?.[1];

  return <ChatHeader email={email} image={image} closeChat={handleCloseChat} />;
};
