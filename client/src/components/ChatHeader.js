import PropTypes from 'prop-types';

import { $App } from '../styles/$App';
import { $ChatList } from '../styles/$ChatList';
import { $ProfileImage } from '../styles/$ProfileImage';
import { $Icons } from '../styles/$Icons';

export const ChatHeader = ({ email, image, closeChat }) => {
  return (
    <$App.Header>
      <$Icons.ArrowLeft size={24} onClick={closeChat} data-testid="arrow" />

      <$ProfileImage
        src={image}
        alt="participants"
        size={40}
        mright={10}
        mleft={10}
      />

      <$ChatList.Content>
        <$ChatList.Name data-testid="email">{email}</$ChatList.Name>
      </$ChatList.Content>

      <$Icons.Video
        size={24}
        color="highlight"
        mright={15}
        data-testid="video"
      />
      <$Icons.Phone size={24} color="highlight" data-testid="phone" />
    </$App.Header>
  );
};

ChatHeader.propTypes = {
  email: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  closeChat: PropTypes.func.isRequired,
};
