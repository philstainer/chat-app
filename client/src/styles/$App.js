import styled from 'styled-components';
import { rem } from 'polished';

export const $App = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme?.backgroundLight};
`;
$App.displayName = '$App';

$App.Wrapper = styled.div`
  overflow: hidden;
`;
$App.Wrapper.displayName = '$App.Wrapper';

$App.Right = styled.div`
  height: 100vh;
  flex: 0 0 100vw;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme?.backgroundLight};
  transform: translateX(-100vw);
`;
$App.Right.displayName = '$App.Right';

$App.Header = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 60px;
  background: ${({ theme }) => theme?.background};
  border-bottom: 1px solid ${({ theme }) => theme?.border};
  padding: ${rem('10px')} ${rem('20px')};
`;
$App.Header.displayName = '$App.Header';

$App.Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;
$App.Content.displayName = '$App.Content';

$App.Footer = styled.div`
  flex: 0 0 60px;
  display: flex;
  padding: ${rem('10px')} ${rem('20px')};
  justify-content: space-between;
  align-items: center;
`;
$App.Footer.displayName = '$App.Footer';
