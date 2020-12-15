import PropTypes from 'prop-types';

import { $App } from '../styles/$App';
import { $ChatList } from '../styles/$ChatList';
import { $ProfileImage } from '../styles/$ProfileImage';
import { $Icons } from '../styles/$Icons';

export const ChatHeader = ({ participants, closeChat }) => {
  const usernames = participants.map(user => user.username).join(', ');

  return (
    <$App.Header>
      <$Icons.ArrowLeft size={24} onClick={closeChat} data-testid="arrow" />

      {participants.map((participant, index) => {
        const marginLeft = index === 0 ? 10 : '-35';
        const zIndex = participants.length - index;

        return (
          <$ProfileImage
            key={participant._id}
            src={participant.image}
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
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  closeChat: PropTypes.func.isRequired,
};
