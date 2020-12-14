import { useReactiveVar } from '@apollo/client';

import { ChatHeader } from '../components/ChatHeader';
import { activeChat } from '../cache';

export const ChatHeaderContainer = () => {
  const rActiveChat = useReactiveVar(activeChat);

  const handleCloseChat = () => activeChat(null);

  const usernames = rActiveChat.participants
    .map(user => user.username)
    .join(', ');
  const images = rActiveChat.participants.map(user => user.image);

  return (
    <ChatHeader
      usernames={usernames}
      images={images}
      closeChat={handleCloseChat}
    />
  );
};
