import styled from 'styled-components';
import { rem } from 'polished';

export const $ChatList = styled.div``;
$ChatList.displayName = '$ChatList';

// Chats
$ChatList.Item = styled.div`
  display: flex;

  padding: ${rem('20px')};
  border-bottom: 1px solid ${({ theme }) => theme?.border};
  cursor: pointer;
`;
$ChatList.Item.displayName = '$ChatList.Item';

$ChatList.Photo = styled.img`
  height: 60px;
  flex: 0 0 60px;
  border-radius: 50%;
  margin-right: ${rem('20px')};
  object-fit: cover;
  object-position: center;
`;
$ChatList.Photo.displayName = '$ChatList.Photo';

$ChatList.Content = styled.div`
  flex: 1;
`;
$ChatList.Content.displayName = '$ChatList.Content';

$ChatList.Name = styled.p`
  font-size: ${({ theme }) => theme?.fontSizes?.small};
  font-weight: ${({ theme }) => theme?.fontWeights?.bold};
  margin-bottom: ${rem('5px')};
`;
$ChatList.Name.displayName = '$ChatList.Name';

$ChatList.Preview = styled.p`
  font-size: ${({ theme }) => theme?.fontSizes?.xSmall};
  opacity: 0.5;

  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
$ChatList.Preview.displayName = '$ChatList.Preview';
