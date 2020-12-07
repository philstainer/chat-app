import { useReactiveVar } from '@apollo/client';
import { activeChat } from '../cache';

import { StyledChat } from '../styles/StyledChat';
import { ChatListContainer } from '../containers/ChatListContainer';
import { ChatContainer } from '../containers/ChatContainer';

export const Home = () => {
  const rActiveChat = useReactiveVar(activeChat);

  return (
    <StyledChat.Wrapper>
      <StyledChat.Left>
        <StyledChat.Header>Menu</StyledChat.Header>
        <ChatListContainer />
      </StyledChat.Left>

      {rActiveChat && (
        <StyledChat.Right>
          <StyledChat.Header>Menu 2</StyledChat.Header>
          <ChatContainer chatId={rActiveChat} />
        </StyledChat.Right>
      )}
    </StyledChat.Wrapper>
  );
};

export default Home;
