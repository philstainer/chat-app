import styled from 'styled-components';
import { rem } from 'polished';

export const $Messages = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${rem('20px')};
`;
$Messages.displayName = '$Messages';

$Messages.Text = styled.div`
  padding: ${rem('5px')};
  font-size: ${({ theme }) => theme?.fontSizes?.small};
`;
$Messages.Text.displayName = '$Messages.Text';

$Messages.Date = styled.div`
  font-size: ${rem('10px')};
  margin-left: 5px;
  align-self: flex-end;
  opacity: 0.8;
`;
$Messages.Date.displayName = '$Messages.Date';

$Messages.Message = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${rem('15px')};
  max-width: 80%;
  align-self: flex-start;
  background: ${({ theme }) => theme?.background};
  border-radius: 10px;
  border-bottom-left-radius: 2px;
  padding: ${rem('5px')};
  ${({ isSmallMargin }) => isSmallMargin && `margin-bottom: ${rem('5px')};`};

  ${({ theme, isMe }) =>
    isMe &&
    `align-self: flex-end;
      border-bottom-left-radius: 10px;
        border-bottom-right-radius: 2px; 
        background: ${theme?.highlight};
        color: ${theme?.white};`};

  /* & > ${$Messages.Text} {
    ${({ theme, isMe }) =>
    isMe &&
    `border-bottom-left-radius: 10px;
        border-bottom-right-radius: 2px; 
        background: ${theme?.highlight};
        color: ${theme?.white};`};
  } */

  & > ${$Messages.Date} {
    ${({ isMe }) => isMe && 'align-self: flex-end;'};
  }
`;
$Messages.Message.displayName = '$Messages.Message';
