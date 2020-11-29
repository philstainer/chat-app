import styled from 'styled-components';
import { rem, opacify } from 'polished';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin: ${rem('50px')} 0;

  & > button {
    margin-top: ${rem('50px')};
  }
`;
StyledForm.displayName = 'StyledForm';

StyledForm.Input = styled.input`
  padding: ${rem('12px')} ${rem('10px')};
  border: 1px solid ${({ theme }) => theme?.border};
  border-radius: 2px;
  outline: none;

  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: ${({ theme }) =>
      theme?.border && opacify(0.2, theme?.border)};
  }
`;
StyledForm.displayName = 'StyledForm.Input';

StyledForm.InputError = styled.p`
  font-size: ${({ theme }) => theme?.fontSizes?.small};
  color: ${({ theme }) => theme?.error};
  margin-top: ${rem('5px')};
`;
StyledForm.InputError.displayName = 'StyledForm.InputError';

StyledForm.Label = styled.label`
  font-size: ${({ theme }) => theme?.fontSizes?.small};
  font-weight: ${({ theme }) => theme?.fontWeights?.bold};
  text-transform: uppercase;
  margin-top: ${rem('20px')};
  margin-bottom: ${rem('5px')};
`;
StyledForm.displayName = 'StyledForm.Label';
