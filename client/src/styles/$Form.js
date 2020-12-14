import styled from 'styled-components';
import { rem, opacify } from 'polished';

export const $Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: ${rem('50px')} 0;

  ${({ psmall }) => psmall && `margin: ${rem('30px')} 0;`}

  & > button {
    margin-top: ${rem('50px')};

    ${({ psmall }) => psmall && `margin-top: ${rem('30px')} 0;`}
  }
`;
$Form.displayName = '$Form';

$Form.Input = styled.input`
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
$Form.displayName = '$Form.Input';

$Form.InputError = styled.p`
  font-size: ${({ theme }) => theme?.fontSizes?.xSmall};
  color: ${({ theme }) => theme?.error};
  margin-top: ${rem('5px')};
`;
$Form.InputError.displayName = '$Form.InputError';

$Form.Label = styled.label`
  font-size: ${({ theme }) => theme?.fontSizes?.xSmall};
  font-weight: ${({ theme }) => theme?.fontWeights?.bold};
  text-transform: uppercase;
  margin-top: ${rem('20px')};
  margin-bottom: ${rem('5px')};
`;
$Form.displayName = '$Form.Label';
