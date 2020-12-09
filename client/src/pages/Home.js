import { useReactiveVar } from '@apollo/client';
import { activeChat } from '../cache';

import { $App } from '../styles/$App';
import { ChatListContainer } from '../containers/ChatListContainer';
import { ChatHeaderContainer } from '../containers/ChatHeaderContainer';
import { ChatContainer } from '../containers/ChatContainer';
import { ChatFooterContainer } from '../containers/ChatFooterContainer';

export const Home = () => {
  const rActiveChat = useReactiveVar(activeChat);

  return (
    <$App.Wrapper>
      <$App>
        <$App.Header>Menu</$App.Header>

        <$App.Content>
          <ChatListContainer />
        </$App.Content>
      </$App>

      {rActiveChat && (
        <$App>
          <ChatHeaderContainer />
          <ChatContainer />
          <ChatFooterContainer />
        </$App>
      )}
    </$App.Wrapper>
  );
};

export default Home;
