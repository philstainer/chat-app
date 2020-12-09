import styled, { keyframes } from 'styled-components';
import { Loader } from 'react-feather';
import { rem } from 'polished';

const Spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

export const $Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: ${rem('12px')} 0;
  color: ${({ theme }) => theme?.white};
  font-size: ${({ theme }) => theme?.fontSizes?.medium};
  font-weight: ${({ theme }) => theme?.fontWeights?.bold};
  background: ${({ theme }) => theme?.highlight};
  outline: none;
  border: none;
  border-radius: 2px;

  transition: opacity 0.3s ease-in-out;
  user-select: none;

  &:active {
    opacity: 0.8;
  }

  cursor: ${({ isLoading }) => (isLoading ? 'wait' : 'pointer')};
`;
$Button.displayName = '$Button';

$Button.Loader = styled(Loader)`
  animation: ${Spin} 4s infinite linear;
`;
$Button.Loader.displayName = '$Button.Loader';
