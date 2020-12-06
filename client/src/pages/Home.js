import { ChatListContainer } from '../containers/ChatListContainer';
import { StyledChat } from '../styles/StyledChat';

export const Home = () => {
  return (
    <StyledChat.Wrapper>
      <StyledChat.Left>
        <StyledChat.Header>Menu</StyledChat.Header>
        <ChatListContainer />
      </StyledChat.Left>

      <StyledChat.Right>
        <StyledChat.Header>Menu</StyledChat.Header>
      </StyledChat.Right>
    </StyledChat.Wrapper>
  );
};

export default Home;
