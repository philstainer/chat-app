import PropTypes from 'prop-types';

import { StyledChat } from '../styles/StyledChat';

export const ChatList = ({ chats, setActiveChat }) => {
  return chats.map((chat) => (
    <StyledChat.Chat
      key={chat._id}
      onClick={() => setActiveChat(chat._id)}
      data-testid="chat"
    >
      <StyledChat.Photo src={chat.participants[1].image} alt="User" />

      <StyledChat.ChatContent>
        <StyledChat.Name>{chat.participants[1].email}</StyledChat.Name>
        <StyledChat.Preview>{chat.lastMessage?.text}</StyledChat.Preview>
      </StyledChat.ChatContent>
    </StyledChat.Chat>
  ));
};

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  setActiveChat: PropTypes.func.isRequired,
};
