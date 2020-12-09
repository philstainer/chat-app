import PropTypes from 'prop-types';

import { $ChatList } from '../styles/$ChatList';

export const ChatList = ({ chats, setActiveChat }) => {
  return chats.map(chat => (
    <$ChatList.Item
      key={chat._id}
      onClick={() => setActiveChat(chat)}
      data-testid="chat"
    >
      <$ChatList.Photo src={chat.participants[1].image} alt="User" />

      <$ChatList.Content>
        <$ChatList.Name>{chat.participants[1].email}</$ChatList.Name>
        <$ChatList.Preview>{chat.lastMessage?.text}</$ChatList.Preview>
      </$ChatList.Content>
    </$ChatList.Item>
  ));
};

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  setActiveChat: PropTypes.func.isRequired,
};
