import styled from 'styled-components';
import { rem } from 'polished';
import { Paperclip } from 'react-feather';

export const $Paperclip = styled(Paperclip)`
  margin-right: ${rem('10px')};
  cursor: pointer;
`;

export const $Send = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 50%;

  margin-left: ${rem('10px')};
  padding: ${rem('10px')};
  background: ${({ theme }) => theme?.highlight};
  color: ${({ theme }) => theme?.white};
  cursor: pointer;
`;

export const $Input = styled.input`
  flex: 1;

  padding: ${rem('8px')} ${rem('15px')};
  border-radius: 20px;
  border: none;
  outline: none;
  background: ${({ theme }) => theme?.background};
`;
