import styled from 'styled-components';
import { rem } from 'polished';

export const StyledMessages = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${rem('20px')};
`;
StyledMessages.displayName = 'StyledMessages';

StyledMessages.Text = styled.div`
  padding: ${rem('5px')};
  font-size: ${({ theme }) => theme?.fontSizes?.small};
`;
StyledMessages.Text.displayName = 'StyledMessages.Text';

StyledMessages.Date = styled.div`
  font-size: ${rem('10px')};
  margin-left: 5px;
  align-self: flex-end;
  opacity: 0.8;
`;
StyledMessages.Date.displayName = 'StyledMessages.Date';

StyledMessages.Message = styled.div`
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

  /* & > ${StyledMessages.Text} {
    ${({ theme, isMe }) =>
    isMe &&
    `border-bottom-left-radius: 10px;
        border-bottom-right-radius: 2px; 
        background: ${theme?.highlight};
        color: ${theme?.white};`};
  } */

  & > ${StyledMessages.Date} {
    ${({ isMe }) => isMe && 'align-self: flex-end;'};
  }
`;
StyledMessages.Message.displayName = 'StyledMessages.Message';
