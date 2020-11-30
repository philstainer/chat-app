import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { rem } from 'polished';

export const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 100vh;
  max-height: 100vh;
  padding: ${rem('30px')};
`;
StyledPage.displayName = 'StyledPage';

StyledPage.Title = styled.h1`
  font-size: ${({ theme, size }) =>
    size ? theme?.fontSizes?.[size] : theme?.fontSizes?.xLarge};
`;
StyledPage.Title.displayName = 'StyledPage.Title';

StyledPage.Description = styled.p`
  margin-top: ${rem('10px')};
`;
StyledPage.Description.displayName = 'StyledPage.Description';

StyledPage.Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;
StyledPage.Actions.displayName = 'StyledPage.Actions';

StyledPage.Action = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme?.fontSizes?.small};
  color: ${({ theme, color }) => color && `${theme?.[color]} !important`};

  & > svg {
    stroke: ${({ theme }) => theme?.fontSizes?.text};
    margin-right: 5px;
  }
`;
StyledPage.Action.displayName = 'StyledPage.Action';
