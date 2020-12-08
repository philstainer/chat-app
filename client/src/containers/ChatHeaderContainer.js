import { ChatHeader } from '../components/ChatHeader';
import { activeChat } from '../cache';

export const ChatHeaderContainer = () => {
  const handleCloseChat = () => activeChat(null);

  return <ChatHeader closeChat={handleCloseChat} />;
};
