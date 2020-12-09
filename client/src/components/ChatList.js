import PropTypes from 'prop-types';

import { $App } from '../styles/$App';
import { $ChatList } from '../styles/$ChatList';
import { $ProfileImage } from '../styles/$ProfileImage';

export const ChatList = ({ chats, setActiveChat }) => {
  return (
    <$App.Content>
      {chats.map(chat => (
        <$ChatList.Item
          key={chat._id}
          onClick={() => setActiveChat(chat)}
          data-testid="chat"
        >
          <$ProfileImage
            src={chat.participants[1].image}
            alt="User"
            mright={20}
          />

          <$ChatList.Content>
            <$ChatList.Name>{chat.participants[1].email}</$ChatList.Name>
            <$ChatList.Preview>{chat.lastMessage?.text}</$ChatList.Preview>
          </$ChatList.Content>
        </$ChatList.Item>
      ))}
    </$App.Content>
  );
};

ChatList.propTypes = {
  chats: PropTypes.array.isRequired,
  setActiveChat: PropTypes.func.isRequired,
};
