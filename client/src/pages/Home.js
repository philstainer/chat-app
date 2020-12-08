import { useReactiveVar } from '@apollo/client';
import { activeChat } from '../cache';

import { StyledChat } from '../styles/StyledChat';
import { ChatListContainer } from '../containers/ChatListContainer';
import { ChatHeaderContainer } from '../containers/ChatHeaderContainer';
import { ChatContainer } from '../containers/ChatContainer';
import { ChatFooterContainer } from '../containers/ChatFooterContainer';

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
          <ChatHeaderContainer />
          <ChatContainer chatId={rActiveChat} />
          <ChatFooterContainer />
        </StyledChat.Right>
      )}
    </StyledChat.Wrapper>
  );
};

export default Home;
