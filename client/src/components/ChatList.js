import PropTypes from 'prop-types';

import { $ChatList } from '../styles/$ChatList';
import { $ProfileImage } from '../styles/$ProfileImage';

export const ChatList = ({ chats, setActiveChat }) => {
  return chats.map(chat => (
    <$ChatList.Item
      key={chat._id}
      onClick={() => setActiveChat(chat)}
      data-testid="chat"
    >
      <$ProfileImage src={chat.participants[1].image} alt="User" mright={20} />

      <$ChatList.Content>
        <$ChatList.Name>{chat.participants[1].username}</$ChatList.Name>
        <$ChatList.Preview>{chat.lastMessage?.text}</$ChatList.Preview>
      </$ChatList.Content>
    </$ChatList.Item>
  ));
};

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  setActiveChat: PropTypes.func.isRequired,
};
