import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { rem } from 'polished';

export const $Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 100vh;
  max-height: 100vh;
  padding: ${rem('30px')};
`;
$Page.displayName = '$Page';

$Page.Title = styled.h1`
  font-size: ${({ theme, size }) =>
    size ? theme?.fontSizes?.[size] : theme?.fontSizes?.xLarge};
`;
$Page.Title.displayName = '$Page.Title';

$Page.Description = styled.p`
  margin-top: ${rem('10px')};
`;
$Page.Description.displayName = '$Page.Description';

$Page.Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;
$Page.Actions.displayName = '$Page.Actions';

$Page.Action = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme?.fontSizes?.xSmall};
  color: ${({ theme, color }) => color && `${theme?.[color]} !important`};

  & > svg {
    stroke: ${({ theme }) => theme?.fontSizes?.text};
    margin-right: 5px;
  }
`;
$Page.Action.displayName = '$Page.Action';
