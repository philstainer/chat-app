import PropTypes from 'prop-types';

import { $App } from '../styles/$App';
import { $ChatList } from '../styles/$ChatList';
import { $ProfileImage } from '../styles/$ProfileImage';
import { $Icons } from '../styles/$Icons';

export const ChatHeader = ({ usernames, images, closeChat }) => {
  return (
    <$App.Header>
      <$Icons.ArrowLeft size={24} onClick={closeChat} data-testid="arrow" />

      {images.map((image, index) => {
        const key = `image-${index + 1}`;
        const marginLeft = index === 0 ? 10 : '-35';
        const zIndex = images.length - index;

        return (
          <$ProfileImage
            key={key}
            src={image}
            alt="participant"
            size={42}
            mright={10}
            mleft={marginLeft}
            index={zIndex}
          />
        );
      })}

      <$ChatList.Content>
        <$ChatList.Name data-testid="usernames" title={usernames}>
          {usernames}
        </$ChatList.Name>
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
  usernames: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  closeChat: PropTypes.func.isRequired,
};
