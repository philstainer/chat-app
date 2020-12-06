import styled from 'styled-components';
import { rem } from 'polished';

export const StyledChat = styled.div``;

StyledChat.Wrapper = styled.div`
  display: flex;
  overflow: hidden;

  background: ${({ theme }) => theme?.backgroundLight};
`;
StyledChat.Wrapper.displayName = 'StyledChat.Wrapper';

StyledChat.Left = styled.div`
  height: 100vh;
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
`;
StyledChat.Left.displayName = 'StyledChat.Left';

StyledChat.Right = styled.div`
  height: 100vh;
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;

  /* transform: translate(-50%, 0%); */
`;
StyledChat.Right.displayName = 'StyledChat.Right';

StyledChat.Header = styled.div`
  flex: 0 0 60px;
  background: ${({ theme }) => theme?.background};
  border-bottom: 1px solid ${({ theme }) => theme?.border};
  padding: ${rem('20px')};
`;
StyledChat.Header.displayName = 'StyledChat.Header';

StyledChat.Chats = styled.div`
  flex: 1;
  overflow-y: auto;
`;
StyledChat.Chats.displayName = 'StyledChat.Chats';

StyledChat.Chat = styled.div`
  display: flex;

  padding: ${rem('20px')};
  border-bottom: 1px solid ${({ theme }) => theme?.border};
  cursor: pointer;
`;
StyledChat.Chat.displayName = 'StyledChat.Chat';

StyledChat.Photo = styled.img`
  height: 60px;
  flex: 0 0 60px;
  border-radius: 50%;
  margin-right: ${rem('20px')};
  object-fit: cover;
  object-position: center;
`;
StyledChat.Photo.displayName = 'StyledChat.Photo';

StyledChat.Name = styled.p`
  font-size: ${({ theme }) => theme?.fontSizes?.small};
  font-weight: ${({ theme }) => theme?.fontWeights?.bold};
  margin-bottom: ${rem('5px')};
`;
StyledChat.Name.displayName = 'StyledChat.Name';

StyledChat.Preview = styled.p`
  font-size: ${({ theme }) => theme?.fontSizes?.xSmall};
  opacity: 0.5;

  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
StyledChat.Preview.displayName = 'StyledChat.Preview';

StyledChat.ChatContent = styled.div`
  flex: 1;
`;
StyledChat.ChatContent.displayName = 'StyledChat.ChatContent';
